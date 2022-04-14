const route =require('express').Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
var contr=require('../controle/inf_controle');
var newman=require('../controle/newman_controle')
var Newman=require('../models/Newman')
const upload =require('../upload/upimg');
const axios =require('axios') 
require('dotenv').config()
const {facebook} =require('../config/config')
const modprofile=require('../models/profile')
passport=require('passport')
var sess=require('express-session')
const FacebookStrategy=require('passport-facebook').Strategy
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
passport.use(new FacebookStrategy({
    clientID:facebook.client_id,
    clientSecret:facebook.client_secret,
    callbackURL:"http://localhost:3000/auth/facebook/callback",
    enableProof:false
  },
  function(accessToken, refreshToken, profile, done) {
    modprofile.findOne({facebookId: profile.id},(err,doc)=>{
        if(err){
            return done(err)
        }
        if(doc){
           return done('this fb is already used')
        }else{
            // if there is no user found with that facebook id, create them
            var newprof= new modprofile();

            // set all of the facebook information in our user model
           newprof.facebookId  = profile.id; // set the users facebook id                   
           newprof.token = profile.token; // we will save the token that facebook provides to the user                    
           newprof.username  = profile.displayName; // look at the passport user profile to see how names are returned

            // save our user to the database
            newprof.save(function(err) {
                if (err)
                    throw err;

                // if successful, return the new user
                return done(null, newprof);
            });
        }
    })
  }
));
passport.serializeUser((user,done)=>{
    done(null, user.id)
})
passport.deserializeUser((id,done)=>{
    influencer.findById(id).then((user)=>{
        done(null,user)
    })
})

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
      validationMassages.push(error.errors[0].msg)
    }else{var validationMassages = null;} 
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
route.get('/influencer/:id',upload.single('image'),(req,res,next)=>{
    contr.getinfbyid(req.params.id)
    .then(doc=>res.status(200).json(doc))
    .catch(err=>res.status(400).json(err))
  })
route.get('/research',(req,res,next)=>{
    contr.search(req.query.fullname)
    .then(doc=>res.status(200).json(doc))
    .catch(err=>res.status(400).json(err))
})
 route.get('/auth/facebook',
   passport.authenticate ('facebook'));
  
 route.get('/auth/facebook/callback', function (req, res, next) {
    var authenticator = passport.authenticate ('facebook', {
      successRedirect: 'http://localhost:4200/influencer/config',
      failureRedirect: '/', 
 });
//  delete req.session.returnTo;
 authenticator (req, res, next);
 })
route.get('/mansofinf/:id',(req,res,next)=>{
    contr.getmanofinf(req.params.id)
    .then(doc=>res.status(200).json(doc))
    .catch(err=>res.status(400).json(err))
})
route.get('/newman/:id_man',(req,res,next)=>{
    newman.getallinvit(req.params.id_man)
    .then(doc=>res.status(200).json(doc))
  })
route.put('/configinf/:id',(req,res,next)=>{
    contr.changepassword(req.params.id,req.body.oldpass,req.body.newpass)
    .then(doc=>res.status(200).json(doc))
    .catch(err=>res.status(400).json(err))
})
route.put('/upavatarofinf/:id',upload.single('image'),(req,res,next)=>{
    contr.upavatar(req.params.id,req.file)
    .then(doc=>res.status(200).json(doc))
})
route.get('/refuseman',(req,res,next)=>{
    var io = req.app.get('socketio');
    newman.removemanfromnewman(req.query.inf_id,req.query.man_id)
    .then(doc=>{res.status(200).json(doc)
        io.emit(`datainf ${doc.id_inf}`,doc.managers)
         
    })
})
route.get('/addnewman',(req,res,next)=>{
    var io = req.app.get('socketio');
    newman.addmantonewman(req.query.id,req.query.manid)
    .then(doc=>{res.status(200).json(doc)
        Newman.findOne({id_inf:doc.id_inf}).populate('managers','-influencers -password').then(doc=>{
            io.emit(`datainf ${doc.id_inf}`,doc.managers)
            if(doc.managers){
            io.emit(`notif ${doc.id_inf}`,true)
        }    
        })  
    })
})
route.get('/newmanid',(req,res,next)=>{
    newman.finding(req.query.id_inf,req.query.id_man)
    .then(doc=>res.status(200).json(doc))
    .catch(err=>res.status(400).json(err))
})
route.get('/findmanid',(req,res,next)=>{
    contr.finding(req.query.id_man,req.query.id_inf)
    .then(doc=>res.status(200).json(doc))
    .catch(err=>res.status(400).json(err))
})
route.delete('/dellistinf/:id_inf',(req,res,next)=>{
    newman.removelistnewman(req.params.id_inf)
    .then(doc=>res.status(200).json(doc))
    .catch(err=>res.status(400).json(err))
})
route.get('/countfb',(req,res,next)=>{
    contr.addprof(req.query.id,req.query.name)
    .then(doc=>res.status(200).json(doc))
    .catch(err=>res.status(400).json(err)) 
})
route.get('/addproftoinf',(req,res,next)=>{
    contr.addproftoinf(req.query.infid,req.query.profid)
    .then(doc=>res.status(200).json(doc))
})
route.get('/getpage',(req,res)=>{
    // const idfacebook =req.query.fbid
    // const text =req.body.text
    // const img=req.body.img;
    // axios.get(`https://graph.facebook.com/v13.0/${idfacebook}?fields=id%2Cname%2Crelationship_status%2Clikes%2Cpermissions%2Cposts&access_token=EAAs9v8bZCsfkBAPGoNtaOw1hw0swX0Ep5Rj9EEENq1Qs3KZCxIKEUMQ3gnLMEHZCHf1noFBJvNwhsSK3znrscZA68cPIyeyzFPbyeEaZCO9MqL2p25x1g81bqSBCKx4LZA27OHLd5UZAa7hm0ZCQv0Lg9mrVMrlLTKkExVGiZAJ7rjshPgbftASn97qZCdiQtKBtY4TiX4ZBsx98XED54aHT5Sw`)
    // .then(function(response){
    //     console.log(response)
    // })
async function getAccessTokenFromCode(code) {
  const { data } = await axios({
    url: 'https://graph.facebook.com/v13.0/oauth/access_token',
    method: 'get',
    params: {
      client_id: facebook.client_id,
      client_secret: facebook.client_secret,
      redirect_uri: 'http://localhost:3000/auth/facebook/cb',
      code,
    },
  });
  console.log(data); // { access_token, token_type, expires_in }
  return data.access_token;
};
})
module.exports=route