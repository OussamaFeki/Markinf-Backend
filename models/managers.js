const mongoose  = require("mongoose");
var bcrypt=require('bcrypt');
const { urlencoded } = require("express");
 managerschema=mongoose.Schema({
     fullname:{
         type:String,
         required:true,
     },
     email:{
         type:String,
         required:true
     },
     image:{
         type:String,
         required:false
     },
     password:{
        type:String,
        required:true 
     },
     influencers:[{type:mongoose.Schema.Types.ObjectId,ref:'influencers'}],
    //  newinf:[{type:mongoose.Schema.Types.ObjectId,ref:'influencers'}]
    
})

managerschema.methods.Hashpass=function(password){
    return(bcrypt.hashSync(password, bcrypt.genSaltSync(5), null))
};

managerschema.methods.Compass=function(password,pass){
    return(bcrypt.compareSync(password,pass))
 };
module.exports=mongoose.model('manager',managerschema);

