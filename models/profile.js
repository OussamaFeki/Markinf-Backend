const mongoose=require('mongoose');
var Profilschema=mongoose.Schema({
    username:String,
    facebookId:String
});
module.exports=mongoose.model('profile',Profilschema);