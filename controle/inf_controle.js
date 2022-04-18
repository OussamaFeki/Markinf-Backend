var influencer= require('../models/influencers');
var mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
var contr=require('../controle/manager_controle')
var manager=require('../models/managers');
var Admin=require('../models/Admin');
var profile=require('../models/profile')
const Newman=require('../models/Newman')
var newinf=require('../controle/newinf_cont')
const fs=require("fs");
const { JsonWebTokenError } = require('jsonwebtoken');
var filepath='./uploads/'
require('dotenv').config();
postNewInf=function(fullname,email,password,repass,error){
    return new Promise((resolve,reject)=>{
        Admin.findOne({email:email},(err,doc)=>{
            if(doc){reject('this email is alredy exist')}
            else{ influencer.findOne({email:email},(er,secc)=>{
                if(secc){reject('this email is alredy exist')}
                else{
                    manager.findOne({email:email},(err,res)=>{
                    if(res){
                    reject('this email is alredy exist')
                    }else if(error){ 
                    reject(error)
                    }
                    else {
                        let newinf=new influencer({
                            fullname,
                            email,
                            password:new influencer().Hashpass(password),
                        }) 
                            // if(image){
                            //     newinf.image=image.path
                            // }
                            newinf.save((err,doc)=>{
                            if (err){
                            
                            reject(err)
                            }
                            else{
                                let boite=new Newman({
                                    id_inf:doc._id
                                })
                                boite.save()
                                resolve(doc);
                            
                                }
                              })     
                            }
                
                        })}})}
            })   
          
         })
}
upavatar=function(id,image){
    return new Promise((resolve,reject)=>{
        influencer.findOne({_id:id},(err,doc)=>{
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
        influencer.updateOne({_id:id},{
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
getall=function(){
    return new Promise((resolve,reject)=>{
        influencer.find({},(err,doc)=>{
            if(err){
                reject(err)
            }
            else{
               resolve(doc)
            }
        })
    })
}
deleteinf=function(id){
    return new Promise((resolve,reject)=>{
        influencer.findOne({_id:id},(err,doc)=>{
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
        influencer.deleteOne({_id:id},(err,doc)=>{
            if (err){
                reject(err)
            }
            else{
                // newinf.removeinffromnewinf()
                resolve(doc);
                
            }
        })    
    })
}
editinf=function(id,fullname,email,password){
    return new Promise((resolve,reject)=>{
        influencer.updateOne({_id:id},{fullname,email,password:new influencer().Hashpass(password)},(err,doc)=>{
            if (err){
                reject(err)
            }else{resolve(doc)}
        })
    })
}

var privatekey=process.env.PRIVATE_KEY
login=function(email,password){
    return new Promise((resolve,reject)=>{
        influencer.findOne({email},(err,doc)=>{ 
            if (doc){
                if (influencer().Compass(password,doc.password)){
                 let token= jwt.sign({
                      fullname:doc.fullname,
                      id:doc._id,
                      image:doc.image,
                      role:'influencer' 
                  },privatekey,{expiresIn:'10d'})
                  resolve({token:token}) ;

                }else{
               reject('this email or password is incorrect') }          
            }else{ reject('this email or password is incorrect')
                // manager.findOne({email},(error,resu)=>{ 
                //     if (resu){
                //         if (manager().Comphash(password,resu.password)){
                //          let token= jwt.sign({
                //               fullname:resu.fullname,
                //               id:resu._id,
                //               role:'manager' 
                //           },privatekey,{expiresIn:'10d'})
                //           resolve({token:token}) ;
        
                //         }else{
                //        reject('this email or password is incorrect') }          
                //     }else{
                //      reject('this email or password is incorrect')
                //     }
                // })
            }
        })
        
    })
}
getmanofinf=function(id){
    return new Promise((resolve,reject)=>{
     influencer.findById(id).populate("managers", "-influencers").then((doc)=>{resolve(doc.managers)})})
}
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
search=function(fullname){
    return new Promise((resolve,reject)=>{
        if(fullname) {
            const regex = new RegExp(escapeRegex(fullname), 'gi');
            influencer.find({fullname:regex},(err,doc)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(doc)
                }
            })
        } else {
            influencer.find({},(err,doc)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(doc)
                }
            })
        }
    })
}
addprof=function(id,name){
    return new Promise((resolve,reject)=>{
        profile.findOne({facebookId: id}).then((currentUser)=>{
            if(currentUser){
                reject('this facebook account is already used')
            }else{
                const newprofile = new profile({
                    username:name,
                    facebookId:id
                })
                newprofile.save().then((doc)=>{
                    resolve(doc)
                })
                 
            }
        })
    })
}
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
getinfbyid=function(id){
    return new Promise((resolve,reject)=>{
        influencer.findOne({_id:id},(err,doc)=>{
        if(err){
            reject(err)
        }else{
            resolve(doc)
        }
        })
    })

}
changepassword=function(id,oldpass,newpass){
    return new Promise((resolve,reject)=>{ 
        influencer.findOne({_id:id},(err,doc)=>{
         if (influencer().Compass(oldpass,doc.password)){
            influencer.updateOne({_id:id},{password:new influencer().Hashpass(newpass)},(err,doc)=>{
                if (err){
                    reject(err)
                }else{
                    resolve(doc)
                    }
            })
               }
         else{
             reject('the oldpassword is incorrect')
         }
    })})
   
}
finding=function(manid,id){
    return new Promise((resolve,reject)=>{
        influencer.findOne({_id:id}).populate('managers','_id').then(doc=>{
            for(let res of doc.managers){
            if(res._id==manid){
                resolve(true)
            }}
            resolve(false)
        })  
    })
}
postfbinf=function(prof){
    return new Promise((resolve,reject)=>{
        influencer.findOne({facebookId:prof.id}).then((currentUser)=>{
            if(currentUser){
                resolve(currentUser)
            }else{
                const newinfluencer = new influencer({
                    username:prof.displayName,
                    facebookId:prof.id
                })
                newinfluencer.save().then((doc)=>{
                    resolve(doc)
                })
                 
            }
        })
    })
}
module.exports={getall,
    postNewInf,
    deleteinf,
    editinf,
    login,
    search,
    removemanfrominf,
    getmanofinf,
    getinfbyid,
    changepassword,
    upavatar,
    finding,
    addprof,
    postfbinf
}