const express = require("express");
const { check, validationResult } = require("express-validator");
const route =express.Router();
const jwt = require('jsonwebtoken');
var contr=require('../controle/Admin_controle');
require('dotenv').config()
route.post('/login',(req,res,next)=>{
    contr.login(req.body.email,req.body.pass)
    .then(doc=>res.status(200).json(doc))
    .catch(err=>res.status(400).json(err))   
})
route.post('/registadm',[check('fullname','full name is required').notEmpty(),
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
    contr.postNewadmin(req.body.fullname,req.body.email,req.body.password,req.body.repass,validationMassages)
    .then(doc=>res.status(200).json({doc,msg:'added!!'}))
    .catch(err=>res.status(400).json(err))
})
route.patch('/edit/:id',(req,res,next)=>{
    contr.updateman(req.params.id,req.body.fullname,req.body.email,req.body.image,req.body.password)
    .then(doc=>res.status(200).json(doc))
    .catch(err=>res.status(400).json(err))
})
route.get('/findadmin',(req,res,next)=>{
    contr.getmanager(req.body.fullname)
    .then(doc=>res.status(200).json(doc))
    .catch(err=>res.status(400).json(err))
})
route.get('/Admins',(req,res,next)=>{
    contr.getall()
    .then(doc=>res.status(200).json(doc))
    .catch(err=>res.status(400).json(err))
})
module.exports=route