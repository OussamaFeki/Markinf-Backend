var manager=require("../models/managers");
var influencer=require("../models/influencers")
const jwt=require('jsonwebtoken');
var Admin=require('../models/Admin');
const Newinf = require("../models/Newinf");

require('dotenv').config();
updateman=function(id,fullname,email,image,password){
  return new Promise((resolve,reject)=>{
      manager.updateOne({_id:id},{fullname,email,image,password:new manager().Hashpass(password)},(err,doc)=>{
        if(err){ 
         reject(err)}
        else{
         resolve(doc)
        }
      })
  })
}
upavatar=function(id,image){
    return new Promise((resolve,reject)=>{
        manager.updateOne({_id:id},{
            image:`http://localhost:3000/image/${image.filename}`
        },(err,doc)=>{
            if(err){ 
                reject(err)}
               else{
                resolve(doc)
               }  
        })
    })
}
registry=function(fullname,email,password,repass,error){
    return new Promise((resolve,reject)=>{
        Admin.findOne({email:email},(err,doc)=>{
            if(doc){reject('this email is alredy exist')}
            else{ influencer.findOne({email:email},(er,doc)=>{
                if(doc){reject('this email is alredy exist')}
                else{
                    manager.findOne({email:email},(err,doc)=>{
                    if(doc){
                    reject('this email is alredy exist')
                    }else{ 
                    if(error){ 
                    reject(error)
                    }
                    else {

                        let newman=new manager({
                            fullname,
                            email,
                            password:new manager().Hashpass(password),
                            image:null
                        })
                            newman.save((err,doc)=>{
                            if (err){
                            
                            reject(err)
                            }
                            else{
                                let boite=new Newinf({
                                    id_manager:doc._id
                                })
                                boite.save()
                                resolve(doc);
                            
                                }
                              })   
                            }}
                
                        })}})}
            })   
        
       })
    }
delman=function(id){
    return new Promise((resolve,reject)=>{
        manager.deleteOne({_id:id},(err,doc)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(doc)
            }
        })
    })
}
var privatekey=process.env.PRIVATE_KEY
loginman=function(email,password){
    return new Promise((resolve,reject)=>{
            manager.findOne({email},(err,doc)=>{ 
                if (doc){
                    if (manager().Compass(password,doc.password)){
                     let token= jwt.sign({
                          fullname:doc.fullname,
                          id:doc._id,
                          image:doc.image,
                          role:'manager' 
                      },privatekey,{expiresIn:'10d'})
                      resolve({token:token}) ;
    
                    }else{
                   reject('this email or password is incorrect') }          
                }else{
                 reject('this email or password is incorrect')
                }
            })
            
        })
    
}
getmanager=function(fullname){
    return new Promise((resolve,reject)=>{
        manager.find({fullname},(err,doc)=>{
        if(err){
            reject(err)
        }else{
            resolve(doc)
        }
        })
    })
    
}
getmanbyid=function(id){
        return new Promise((resolve,reject)=>{
            manager.findOne({_id:id},(err,doc)=>{
            if(err){
                reject(err)
            }else{
                resolve(doc)
            }
            })
        })
}
getallman=function(){
    return new Promise((resolve,reject)=>{
        manager.find({},(err,doc)=>{
            if(err){
                reject(err)
            }else{
                resolve(doc)
            }
        })
    })
}
getinfofman=function(id){
    return new Promise((resolve,reject)=>{
     manager.findById(id).populate("influencers", "-managers").then((doc)=>{resolve(doc.influencers)})})
}
removeinffromman= function(manId, infId) {
    return new Promise((resolve,reject)=>{
        influencer.findOne({_id:infId},(err,doc)=>{
            if(err){
                reject(err)
            }else{
                manager.findByIdAndUpdate(
                    manId,
                    { $pull:{ influencers: doc._id }},
                    { new: true, useFindAndModify: false }
                  ,(err,doc)=>{
                      if (err){
                          reject(err)
                      }else{
                          resolve(doc)
                      }
                  })

            } 
        })
    }) ;
};
removemanfrominf=function(infId,manId){
    return new Promise ((resolve,reject)=>{
        manager.findOne({_id:manId},(err,man)=>{
            if (err){
                reject(err)
            }else{
                influencer.findByIdAndUpdate(
                    infId,
                    {$pull:{managers:man._id}},
                    { new: true, useFindAndModify: false}
                 ,(err,doc)=>{if (err){
                     reject(err)
                 }
                else{
                    resolve(doc)
                }
                })
            }
        })
    }) 
}
// fiering=function(manId,docu,id,doc){
// removeinffromman(manId,docu)
// removemanfrominf(id,doc)
// }
// fier=function(manId,id){
//         influencer.findOne({_id:id},(error,docu)=>{
//             if (error){
//                 reject(error)
//             }else{
//                resolve(removeinffromman(manId,docu))
                
//             }
//            })
// }
changepassword=function(id,oldpass,newpass){
    return new Promise((resolve,reject)=>{ 
        manager.findOne({_id:id},(err,doc)=>{
         if (manager().Compass(oldpass,doc.password)){
            manager.updateOne({_id:id},{password:new manager().Hashpass(newpass)},(err,data)=>{
                if (err){
                    reject(err)
                }else{
                    resolve(data)
                    }
            })
               }
         else{
             reject('the oldpassword is incorrect')
         }
    })})
   
}
module.exports={loginman,updateman,delman,registry,
    getmanager,
    getallman,
    getinfofman,
    getmanbyid,
    removeinffromman,
    removemanfrominf,
    upavatar,
    changepassword}