const mongoose=require('mongoose');
var Profilschema=mongoose.Schema({
    usename:String,
    facebookId:String
});
module.exports=mongoose.model('profile',Profilschema);