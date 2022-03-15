var mongoose=require('mongoose');
var bcrypt=require('bcrypt')
var newinf=mongoose.Schema({
    id_manager:{
        type:String,
        required:true
    },
    influencers:[{type:mongoose.Schema.Types.ObjectId,ref:'influencers'}]
    //  avatar:{
    //       data:Buffer,
    //       contentType:String,
    //       required:false
    //   }
});
module.exports=mongoose.model('newinf',newinf);