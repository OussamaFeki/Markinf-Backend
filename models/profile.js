const mongoose=require('mongoose');
var Profilschema=mongoose.Schema({
    username:String,
    facebookId:String,
    token:String,
    posts:[{
        id:String
    }]
});
module.exports=mongoose.model('profile',Profilschema);