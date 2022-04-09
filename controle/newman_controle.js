var manager=require('../models/managers');
var Newman = require('../models/Newman');
var influencer=require('../models/influencers');
// getallinvit=function(id){
//     return new Promise((resolve,reject)=>{
//         resolve(getnewmanWithPopulate(id))
        
//     })
// }
getall=function(){
    return new Promise((resolve,reject)=>{
        resolve(Newman.find({}).populate('managers',"email"))
    })
}
const getnewmanWithPopulate = function(id) {
    return Newman.findById(id).populate("managers", " -influencers");
};
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
removemanfromnewman=function(infId,manId){
    return new Promise((resolve,reject)=>{
     manager.findOne({_id:manId},(err,man)=>{
         if(err){
             reject(err)
         }else{
            Newman.findOneAndUpdate(
                {id_inf:infId},
                {$pull:{managers:man._id}},
                { new: true, useFindAndModify: false }
            ,(err,doc)=>{
            if(err){
                reject(err)
            }else{
                resolve(doc)
            }
            })
         }
     })
    })
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
addmantonewman=function(infId,manId){
    return new Promise((resolve,reject)=>{
        manager.findOne({_id:manId},(err,man)=>{
            if(err){
                reject(err)
            }else{
                Newman.findOneAndUpdate(
                    {id_inf:infId},
                    { $addToSet: { managers: man._id } },
                    { new: true, useFindAndModify: false }
                  ,(err,doc)=>{
                      if(err){
                          reject(err)
                      }else{
                          resolve(doc)
                      }
                  });
            }
        })
    })
}
// invitinf=function(id_man,id){ 
//     return new Promise((resolve,reject)=>{
//      manager.findOne({_id:id_man},(err,doc)=>{
//          if(err){
//              reject(err)
//          }else{
//             addmantonewman(id,doc)
//             resolve('invited')
//          }
//      })
           
//     })
// }
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
getallinvit=function(id){
    return new Promise((resolve,reject)=>{
        Newman.findOne({id_inf:id}).populate('managers','-influencers -password').then(doc=>{
            resolve(doc.managers)
        })    
    })
}
finding=function(manid,id){
    return new Promise((resolve,reject)=>{
        Newman.findOne({id_inf:id}).populate('managers','_id').then(doc=>{
            for(let res of doc.managers){
            if(res._id==manid){
                resolve(true)
            }}
            resolve(false)
        })  
    })
}
removelistnewman=function(id){
    return new Promise((resolve,reject)=>{
        newinf.deleteOne({id_inf:id},(err,doc)=>{
            if(err){
                reject(err)
            }else{
                resolve(doc)
            }
        })
    })
    
}
module.exports={getallinvit,addmantoinf,addmantonewman,removemanfromnewman,finding,removelistnewman}