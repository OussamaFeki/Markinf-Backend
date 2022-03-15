const route =require('express').Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
var contr=require('../controle/inf_controle');

require('dotenv').config()
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
route.get('/',(req,res,next)=>{
      res.send('connected')
})
var privatekey=process.env.PRIVATE_KEY
verifytoken=(req,res,next)=>{
    let token=req.headers.authorization
    if(!token){
    res.status(400).json({msg:'access rejected ...!!!'})
    }
    try{
     let verif=jwt.verify(token,privatekey)
     next()
    }catch(e){
        res.status(400).json({msg:e})
    }
}
var secretKey=process.env.SECRET_KEY;
var clientkey=process.env.CLIENT_KEY;
verifySecretclient=(req,res,next)=>{
 let sk=req.params.secret
 let ck=req.params.client
 if(sk==secretKey && ck==clientkey){
     next()
 }else{
    res.status(400).json({error:"you can't access to tis route without secret key and client key"})  
 }
}


route.post('/addinf',[check('fullname','full name is required').notEmpty(),
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
    contr.postNewInf(req.body.fullname,req.body.email,req.body.password,req.body.repass,validationMassages)
    .then((doc)=>{res.status(200).json({doc,msg:'added !!'})})
    .catch((err)=>{res.status(400).json(err)})
}
)
route.get('/influencers',(req,res,next)=>{
    // let token=req.headers.authorization
    // let user=jwt.decode(token,{complete:true})
    contr.getall()
    .then((doc)=>{res.status(200).json(doc)})
    .catch((err)=>{res.status(400).json(err)})
})
route.post('/login',(req,res,next)=>{
    contr.login(req.body.email,req.body.pass)
    .then((doc)=>{res.status(200).json(doc)})
    .catch((err)=>{res.status(400).json(err)})
})
route.delete('/delete/:id',(req,res,next)=>{
    contr.deleteinf(req.params.id).then((doc)=>{res.status(200).json(doc)})
    .catch((err)=>{res.status(400).json(err)})
});
route.patch('/updateinf/:id',verifytoken,(req,res,next)=>{
    contr.editinf(req.params.id,req.body.fullname,req.body.email,req.body.password)
    .then((doc=>{res.status(200).json(doc)}))
    .catch((err)=>{res.status(400).json(err)})
})
route.post('/research',(req,res,next)=>{
    contr.search(req.body.fullname)
    .then(doc=>res.status(200).json(doc))
    .catch(err=>res.status(400).json(err))
})

module.exports=route