const express = require("express");
const { check, validationResult } = require("express-validator");
const route =express.Router();
const jwt = require('jsonwebtoken');
var contr=require('../controle/manager_controle');
var newinf=require('../controle/newinf_cont');
var newman=require('../controle/newman_controle');
const upload =require('../upload/upimg')
var modnewinf=require('../models/Newinf');
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
],upload.single('image'),(req,res,next)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){
    var validationMassages=[]
    //for(var i=0 ;i<error.errors.length ; i++){
      validationMassages.push(error.errors[0].msg)
    //}
  }else{var validationMassages = null;}
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
route.get('/manager/:id',upload.single('image'),(req,res,next)=>{
  contr.getmanbyid(req.params.id)
  .then(doc=>res.status(200).json(doc))
  .catch(err=>res.status(400).json(err))
})
route.get('/infsofman/:id_man',(req,res,next)=>{
  var io = req.app.get('socketio');
    contr.getinfofman(req.params.id_man)
    .then(doc=>{res.status(200).json(doc)
      io.emit("event test", doc);
    })
    .catch(err=>res.status(400).json(err))
})
route.get('/newinf/:id_man',(req,res,next)=>{
  newinf.getallinvit(req.params.id_man)
  .then(doc=>res.status(200).json(doc))
})
route.get('/newinfid',(req,res,next)=>{
  newinf.finding(req.query.id_man,req.query.id_inf)
  .then(doc=>res.status(200).json(doc))
  .catch(err=>res.status(400).json(err))
})
route.get('/allNewinf',(req,res,next)=>{
  newinf.getallnewinf().then(doc=>res.status(200).json(doc))
})
//don't touch
route.get('/addnewinf',(req,res,next)=>{
  var io = req.app.get('socketio');
 newinf.addinftonewinf(req.query.id,req.query.infid)
 .then(doc=>{res.status(200).json(doc)
   modnewinf.findOne({id_manager:doc.id_manager}).populate('influencers','-managers  -password').then(doc=>{
     io.emit(`data ${doc.id_manager}`,doc.influencers)
     io.emit(`notifman ${doc.id_manager}`,true) 
    })
})
})
route.get('/addinfs',(req,res,next)=>{
  // newinf.addmantoinf(req.body.id,req.params.man_id)
  // .then(doc=>res.status(200).json({doc:doc,msg:'added'}))
  newinf.addinftoman(req.query.man_id,req.query.id)
  .then(doc=>res.status(200).json({doc:doc,msg:'added'}))
})
route.get('/addman',(req,res,next)=>{
  newinf.addmantoinf(req.query.id,req.query.man_id)
  .then(doc=>res.status(200).json({doc:doc,msg:'added'}))
})
route.get('/refuse',(req,res,next)=>{
  var io = req.app.get('socketio');
  newinf.removeinffromnewinf(req.query.man_id,req.query.id)
  .then(doc=>{res.status(200).json(doc.influencers)
      io.emit(`data ${doc.id_manager}`,doc.influencers)
      // if(!doc.influencers){
      //   io.emit(`notifman ${doc.id_manager}`,false)
      // }
       
    //  })
  })
})
route.get('/fir',(req,res,next)=>{
  contr.removeinffromman(req.query.man_id,req.query.id)
  .then(doc=>res.status(200).json({doc:doc,msg:'fired'}))
})
route.get('/fired',(req,res,next)=>{
  contr.removemanfrominf(req.query.id,req.query.man_id)
  .then(doc=>res.status(200).json({doc,msg:'fired'}))
})
route.put('/upavatar/:man_id',upload.single('image'),(req,res,next)=>{
  contr.upavatar(req.params.man_id,req.file)
  .then(doc=>res.status(200).json(doc))
})
route.delete('/delman/:id',(req,res,next)=>{
  contr.delman(req.params.id)
  .then(doc=>res.status(200).json(doc))
  .catch(err=>res.status(400).json(err))
})
route.delete('/dellist/:id_man',(req,res,next)=>{
  newinf.removelistnewinf(req.params.id_man)
  .then(doc=>res.status(200).json(doc))
  .catch(err=>res.status(400).json(err))
})
route.patch('/configman/:id_man',(req,res,next)=>{
  contr.changepassword(req.params.id_man,req.body.oldpass,req.body.newpass)
  .then(doc=>res.status(200).json(doc))
  .catch(err=>res.status(400).json(err))
})
route.get('/researchman',(req,res,next)=>{
  contr.search(req.query.fullname)
  .then(doc=>res.status(200).json(doc))
  .catch(err=>res.status(400).json(err))
})
route.get('/infid',(req,res,next)=>{
  var io = req.app.get('socketio');
  const idman=req.query.id_man
  contr.finding(req.query.id_inf,req.query.id_man)
  .then(doc=>{
    res.status(200).json(doc)
    io.emit(`find${idman}`,doc)
  })
  .catch(err=>res.status(400).json(err))
})
module.exports=route