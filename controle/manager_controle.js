var manager=require("../models/managers");
var influencer=require("../models/influencers")
const jwt=require('jsonwebtoken');
var Admin=require('../models/Admin');
const Newinf = require("../models/Newinf");
var fs=require("fs")
var filepath='./uploads/'
let managersids=[]
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
        manager.findOne({_id:id},(err,doc)=>{
            if(err){
                console.log('error of foundation')
            }else{
                if(doc.image){
                imagename=doc.image.slice(28)
                fs.unlink(filepath+imagename,(err)=>{
                     if(err){
                         reject('error in deleting file')
                     }
                     else{
                         console.log('deleted succesfully')
                     }
                 })}else{
                     console.log('there is no file to delete')
                 }
            }
        })
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
        manager.findOneAndDelete({_id:id},(err,doc)=>{
            if(err){
                reject(err)
            }
            else{
                if(doc.image){
                imagename=doc.image.slice(28)
                fs.unlink(filepath+imagename,(err)=>{
                     if(err){
                         reject('error in deleting file')
                     }
                     else{
                         console.log('deleted succesfully')
                     }
                 })
                }else{
                    console.log('there is no file to delete')
                }
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
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
search=function(fullname){
    return new Promise((resolve,reject)=>{
        if(fullname) {
            const regex = new RegExp(escapeRegex(fullname), 'gi');
            manager.find({fullname:regex},(err,doc)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(doc)
                }
            })
        } else {
            manager.find({},(err,doc)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(doc)
                }
            })
        }
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
finding=function(infid,id){
    return new Promise((resolve,reject)=>{
        manager.findOne({_id:id}).populate('influencers','_id').then(doc=>{
            for(let res of doc.influencers){
            if(res._id==infid){
             resolve(true)
            }}
            resolve(false)
        })  
    })
}
module.exports={loginman,updateman,delman,registry,
    getmanager,
    getallman,
    getinfofman,
    getmanbyid,
    removeinffromman,
    removemanfrominf,
    upavatar,
    changepassword,
    search,
    finding}