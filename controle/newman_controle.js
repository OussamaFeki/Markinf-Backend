var manager=require('../models/managers');
var Newman = require('../models/Newman');
var influencer=require('../models/influencers');
getallinvit=function(id){
    return new Promise((resolve,reject)=>{
        resolve(getnewmanWithPopulate(id))
        
    })
}
getall=function(){
    return new Promise((resolve,reject)=>{
        resolve(Newman.find({}).populate('managers',"email"))
    })
}
const getnewmanWithPopulate = function(id) {
    return Newman.findById(id).populate("managers", " -influencers");
};
const addinftoman = function(manId, inf) {
    return manager.findByIdAndUpdate(
      manId,
      { $addToSet: { influencers: inf._id } },
      { new: true, useFindAndModify: false }
    );
};

const addmantoinf=function(infId,man){
    return influencer.findByIdAndUpdate(
       infId,
       {$addToSet:{ managers: man._id}},
       { new: true, useFindAndModify: false}
    )
}
const removemanfromnewman=function(infId,man){
    return Newman.findByIdAndUpdate(
        {id_inf:infId},
        {$pull:{managers:man._id}},
        { new: true, useFindAndModify: false }
    )
}
accepter=function(id_influencer,id){
    return new Promise((resolve,reject)=>{
     manager.findOne({_id:id},(err,doc)=>{
         if(err){
             reject(err)
         }else{
             influencer.findOne({_id:id_influencer},(error,docu)=>{
              if (error){
                  reject(error)
              }else{
                
                resolve(addinftoman(id,docu),
                addmantoinf(id_influencer,doc),
                removemanfromnewman(id_influencer,doc))
              }
             })
         }
         
     })
    })
}
const addmantonewman=function(manId,man){
    return Newman.findByIdAndUpdate(
        manId,
        { $addToSet: { Manager: man._id } },
        { new: true, useFindAndModify: false }
      );
}
invitinf=function(id_man,id){ 
    return new Promise((resolve,reject)=>{
     manager.findOne({_id:id_man},(err,doc)=>{
         if(err){
             reject(err)
         }else{
            addmantonewman(id,doc)
            resolve('invited')
         }
     })
           
    })
}
refuse=function(id_influencer,id){
    return new Promise((resolve,reject)=>{
     manager.findOne({_id:id},(error,docu)=>{
        if (error){
            reject(error)
            }else{
                removemanfromnewman(id_influencer,docu)
                resolve('refused') }
                })
       })

} 
module.exports={getallinvit,refuse,accepter}