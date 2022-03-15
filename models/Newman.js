var mongoose=require('mongoose');
var bcrypt=require('bcrypt')
var newman=mongoose.Schema({
    id_inf:{
     type:String,
     required:true
    },
    managers:[{type:mongoose.Schema.Types.ObjectId,ref:'manager'}]
    //  avatar:{
    //       data:Buffer,
    //       contentType:String,
    //       required:false
    //   }
});
module.exports=mongoose.model('newman',newman);