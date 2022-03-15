const express = require("express");
const { check, validationResult } = require("express-validator");
const route =express.Router();
const jwt = require('jsonwebtoken');
var contr=require('../controle/manager_controle');
var newinf=require('../controle/newinf_cont');
var newman=require('../controle/newman_controle');
const multer=require('multer');
const storage =multer.diskStorage({
    destination:(req, file, callBack)=>{
        callBack(null,'upload')
    },
    filename:(req, file, callBack)=>{
        callBack(null,file.originalname)
    }
})
var upload =multer({ storage: storage })
require('dotenv').config()
route.post('/loginman',(req,res,next)=>{
    contr.loginman(req.body.email,req.body.pass)
    .then(doc=>res.status(200).json(doc))
    .catch(err=>res.status(400).json(err))   
})
route.post('/registery',[check('fullname','full name is required').notEmpty(),
check('email','email is required').notEmpty(),
check('email','this is not email').isEmail(),
check('password','The password must be 4+ chars long and contain a number ').isLength({min: 4}),
check('repass').custom((value, {req})=>{
  if(value!==req.body.password){
    throw new Error('password and confirm-password not matched')
  }
  return true;
})
],(req,res,next)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){
    var validationMassages=[]
    for(var i=0 ;i<error.errors.length ; i++){
      validationMassages.push(error.errors[i].msg)
    }}else{var validationMassages = null;}
    contr.registry(req.body.fullname,req.body.email,req.body.password,req.body.repass,validationMassages)
    .then(doc=>res.status(200).json({doc,msg:'added!!'}))
    .catch(err=>res.status(400).json(err))
})
route.patch('/edit/:id',(req,res,next)=>{
    contr.updateman(req.params.id,req.body.fullname,req.body.email,req.body.image,req.body.password)
    .then(doc=>res.status(200).json(doc))
    .catch(err=>res.status(400).json(err))
})
route.get('/find',(req,res,next)=>{
    contr.getmanager(req.body.fullname)
    .then(doc=>res.status(200).json(doc))
    .catch(err=>res.status(400).json(err))
})
route.get('/managers',(req,res,next)=>{
    contr.getallman()
    .then(doc=>res.status(200).json(doc))
    .catch(err=>res.status(400).json(err))
})
route.get('/manager/:id',(req,res,next)=>{
  contr.getmanbyid(req.params.id)
  .then(doc=>res.status(200).json(doc))
  .catch(err=>res.status(400).json(err))
})
route.get('/infsofman/:id_man',(req,res,next)=>{
    contr.getinfofman(req.params.id_man)
    .then(doc=>res.status(200).json(doc))
    .catch(err=>res.status(400).json(err))
})
route.get('/newinf/:id_man',(req,res,next)=>{
  newinf.getallinvit(req.params.id_man)
  .then(doc=>res.status(200).json(doc))
})
route.get('/allNewinf',(req,res,next)=>{
  newinf.getallnewinf().then(doc=>res.status(200).json(doc))
})
route.post('/addnewinf',(req,res,next)=>{
 newinf.invitman(req.body.infid,req.body.id)
 .then(doc=>res.status(200).json(doc))
})
route.post('/addinfs/:man_id',(req,res,next)=>{
  newinf.accepter(req.params.man_id,req.body.id)
  .then(doc=>res.status(200).json({doc:doc,msg:'added'}))
})
route.post('/refuse/:id_man',(req,res,next)=>{
  newinf.refuse(req.params.id_man,req.body.id)
  .then(doc=>res.status(200).json(doc))
})
route.delete('/fier/:man_id',(req,res,next)=>{
  contr.fier(req.params.man_id,req.body.id)
  .then(doc=>res.status(200).json({doc:doc,msg:'fierd'}))
})
module.exports=route