var mongoose=require('mongoose');
var bcrypt=require('bcrypt')
var influencer=mongoose.Schema({
    fullname:{
        type:String,
        require:true
    },
    facebookId:{
        type:String,
        required:false
    },
    email:{
        type:String,
        required:false
    },
    password:{
        type:String,
        required:false,
    },
    // profile:{
    //     type:mongoose.Schema.Types.ObjectId,ref:'profile'
    // },
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
