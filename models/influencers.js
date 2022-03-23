var mongoose=require('mongoose');
var bcrypt=require('bcrypt')
var influencer=mongoose.Schema({
    fullname:{
        type:String,
        require:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    facebook_id:{
        type:String,
        required:false
    },
    image:{
        type:String,
        required:false,
    },
    managers:[{type:mongoose.Schema.Types.ObjectId,ref:'manager'}],
    // newman:[{type:mongoose.Schema.Types.ObjectId,ref:'manager'}]
});
influencer.methods.Hashpass=function(pass){
return(bcrypt.hashSync(pass, bcrypt.genSaltSync(5), null))
};
influencer.methods.Compass=function(password,pass){
    return(bcrypt.compareSync(password,pass))
}
module.exports=mongoose.model('influencers',influencer);
