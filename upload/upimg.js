const multer=require('multer');
const express=require('express')
const storage =multer.diskStorage({
    destination:(req, file, callBack)=>{
        callBack(null,'upload')
    },
    filename:(req, file, callBack)=>{
        callBack(null,file.originalname)
    }
})
var upload =multer({ storage: storage })
