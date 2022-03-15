var products=require('../models/Products');

addProduct=function(name,mark,image,description,price,tag,id){
    return new Promise((resolve,reject)=>{
        let newProduct=new products({
            name,
            mark,
            image,
            description,
            price,
            tag,
            id_manager:id 
        });
        newProduct.save((err,doc)=>{
            if(err){
                reject(err)
            }else{
                resolve(doc)
            }
        })
    })  
}
getallProd=function(){
    return new Promise((resolve,reject)=>{
        products.find({},(err,doc)=>{
            if (err){
                reject(err)
            }
            else{
                resolve(doc)
            }
        })
    })
}
deleteProd=function(id){
    return new Promise((resolve,reject)=>{
        products.deleteOne({_id:id},(err,doc)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(doc)
            }
        })
    })
}
getone=function(id){
 return new Promise((resolve,reject)=>{
     products.findOne({_id:id},(err,doc)=>{
         if(err){
             reject(err)
         }
         else{
             resolve(doc)
         }
     })
 })
}
updateProd=function(id,name,mark,image,description,price){
    return new Promise((resolve,reject)=>{
        products.updateOne({_id:id},{name,mark,image,description,price},(err,doc)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(doc)
            }
        })
    })

}
getprodofman=function(id){
  return new Promise((resolve,reject)=>{
      products.find({id_manager:id},(err,doc)=>{
        if(err){
            reject(err)
        }
        else{
            resolve(doc)
        }
    })
  })
}
module.exports={getallProd,addProduct,getone,deleteProd,updateProd,getprodofman}