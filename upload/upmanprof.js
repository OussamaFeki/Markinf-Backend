const multer=require('multer');
const path=require('path')
const storage =multer.diskStorage({
    destination:'./uploadmans'
    //(req, file, callBack)=>{
        //callBack(null,'uploads')
    //}
    ,
    filename:(req, file, callBack)=>{
          let ext =path.extname(file.originalname)
        //  callBack(null, Date.now() + ext)
        return callBack(null, `${file.fieldname}_${Date.now()}${ext}`)
     }
})
var upload =multer({
    storage: storage,
     fileFilter: function (req,file,callBack){
         if(file.mimetype ==="image/png"||
           file.mimetype ==="image/jpg" ||
           file.mimetype == "image/jpeg"      
           ){
             callBack(null,true)
         }else{
             console.log('only jpg & png file supported!')
             callBack(null,false)
         }
    },
    limits:{
        fileSize: 1024 * 1024 *2
    }
})
module.exports=upload