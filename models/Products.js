const mongoose=require('mongoose');


var Productschema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    mark:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    tag:{
        type:String,
        required:true
    },
    id_manager:{
        type:String,
        required:false
    }
})

module.exports=mongoose.model('Product',Productschema)