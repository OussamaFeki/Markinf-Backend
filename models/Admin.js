const mongoose  = require("mongoose");
var bcrypt=require('bcrypt');
 Adminschema=mongoose.Schema({
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
     }
})

Adminschema.methods.Hashpass=function(password){
    return(bcrypt.hashSync(password, bcrypt.genSaltSync(5), null))
};

Adminschema.methods.Compass=function(password,pass){
    return(bcrypt.compareSync(password,pass))
 };
module.exports=mongoose.model('Admin',Adminschema);