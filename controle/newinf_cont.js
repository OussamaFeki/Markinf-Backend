var newinf=require('../models/Newinf');
var mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
var contr=require('../controle/manager_controle')
var manager=require('../models/managers');
var Admin=require('../models/Admin');
var influencer=require('../models/influencers');
const { populate } = require('../models/Newinf');

getallinvit=function(id){
    return new Promise((resolve,reject)=>{
        newinf.findOne({id_manager:id}).populate('influencers','-managers  -password').then(doc=>{
            resolve(doc.influencers)
        })    
    })
}
getallnewinf=function(){
    return new Promise((resolve,reject)=>{
        resolve(newinf.find({}).populate('influencers','email fullname'))
    })
}
addinftonewinf=function(manId,infid){
    return new Promise((resolve,reject)=>{
        influencer.findOne({_id:infid},(err,doc)=>{
            if (err){
                reject(err)}
            // else{
            //     resolve(doc)
            // }
             else{
                 newinf.findOneAndUpdate(
                     {id_manager:manId},
                     { $addToSet: { influencers: doc._id} },
                     { new: true, useFindAndModify: false },
                     (err,doc)=>{
                         if(err){
                             reject(err)
                         }else{
                             resolve(doc)
                         }
                     }
                   );
             }
        })
    })
}
addinftoman = function(manId, infid) {
    return new Promise ((resolve,reject)=>{
        influencer.findOne({_id:infid},(err,inf)=>{
            if(err){
                reject(err)
            }else{
                manager.findByIdAndUpdate(
                    manId,
                    { $addToSet: { influencers: inf._id } },
                    { new: true, useFindAndModify: false },
                    (err,doc)=>{
                        if(err){
                            reject(err)
                        }else {
                            resolve(doc)
                        }
                    }
                  )
            }
        })
    })
};
addmantoinf=function(infId,manid){
    return new Promise ((resolve,reject)=>{
        manager.findOne({_id:manid},(err,man)=>{
           if (err){
               reject(err)
           }else{
            influencer.findByIdAndUpdate(
                infId,
                {$addToSet:{ managers: man._id}},
                { new: true, useFindAndModify: false}
             ,(err,doc)=>{
                 if (err){
                     reject(err)
                 }else{
                     resolve(doc)
                 }
             })
           }
        })
    })
}
//for Newinf
removeinffromnewinf=function(manid, infid){
    return new Promise((resolve,reject)=>{
        influencer.findOne({_id:infid},(err,inf)=>{
            if(err){
                reject(err)
            }else {
                // resolve(inf)
                 newinf.findOneAndUpdate(
                     {id_manager:manid},
                     {$pull:{influencers:inf._id}},
                     { new: true, useFindAndModify: false },
                     (err,doc)=>{
                         if(err){
                             reject(err)
                         }else{
                             resolve(doc)
                         }
                     }
                 )
            }
        })
    })
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
removelistnewinf=function(id){
    return new Promise((resolve,reject)=>{
        newinf.deleteOne({id_manager:id},(err,doc)=>{
            if(err){
                reject(err)
            }else{
                resolve(doc)
            }
        })
    })
    
}

module.exports={getallinvit,refuse,accepter,addinftonewinf,getallnewinf,removeinffromnewinf,addmantoinf,addinftoman,removelistnewinf}