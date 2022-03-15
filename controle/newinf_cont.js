var newinf=require('../models/Newinf');
var mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
var contr=require('../controle/manager_controle')
var manager=require('../models/managers');
var Admin=require('../models/Admin');
var influencer=require('../models/influencers');
const Newman = require('../models/Newman');
const { populate } = require('../models/Newinf');

getallinvit=function(id){
    return new Promise((resolve,reject)=>{
        newinf.findOne({id_manager:id}).populate('influencers','-managers -image -password').then(doc=>{
            resolve(doc.influencers)
        })    
    })
}
getallnewinf=function(){
    return new Promise((resolve,reject)=>{
        resolve(newinf.find({}).populate('influencers','email fullname'))
    })
}
const addinftonewinf=function(manId,man){
    return newinf.findOneAndUpdate(
        {id_manager:manId},
        { $addToSet: { influencers: man._id } },
        { new: true, useFindAndModify: false }
      );
}
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
const removemanfrominf=function(infId,man){
    return influencer.findByIdAndUpdate(
       infId,
       {$pull:{managers:man._id}},
       { new: true, useFindAndModify: false}
    )
}
const removeinffromman= function(manId, inf) {
    return manager.findByIdAndUpdate(
      manId,
      { $pull:{ influencers: inf._id }},
      { new: true, useFindAndModify: false }
    );
};
//for Newinf
const removeinffromnewinf=function(manId, inf){
    return newinf.findByIdAndUpdate(
        {id_manager:manId},
        {$pull:{influencers:inf._id}},
        { new: true, useFindAndModify: false }
    )
}
//for Newman
const removemanfromnewman=function(infId,man){
    return Newman.findByIdAndUpdate(
        {id_inf:infId},
        {$pull:{managers:man._id}},
        { new: true, useFindAndModify: false }
    )
}

accepter=function(id_manager,id){
    return new Promise((resolve,reject)=>{
     manager.findOne({_id:id_manager},(err,doc)=>{
         if(err){
             reject(err)
         }else{
             influencer.findOne({_id:id},(error,docu)=>{
              if (error){
                  reject(error)
              }else{
               resolve(addinftoman(id_manager,docu),addmantoinf(id,doc),removeinffromnewinf(id_manager,docu))
              }
             })
         }
         
     })
    })
}
refuse=function(id_manager,id){
    return new Promise((resolve,reject)=>{
     influencer.findOne({_id:id},(error,docu)=>{
        if (error){
            reject(error)
            }else{
                //removeinffromnewinf(id_manager,docu)
                resolve(removeinffromnewinf(id_manager,docu)) }
                    
                })
       })

} 
var getnewinfWithPopulate = function(id) {
    return newinf.findOne({id_manager:id}).populate("influencers", "-manager");
};
invitman=function(id_inf,id){ 
    return new Promise((resolve,reject)=>{
     influencer.findOne({_id:id_inf},(err,doc)=>{
         if(err){
             reject(err)
         }else{
            // addinftonewinf(id,doc)
            resolve(()=>addinftonewinf(id,doc))
         }
     })
           
    })
}


module.exports={getallinvit,refuse,accepter,invitman,getallnewinf,removeinffromnewinf}