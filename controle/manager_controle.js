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
                            image:"assets/admin/img/undraw_profile.svg"
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
            manager.find({_id:id},(err,doc)=>{
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
const removeinffromman= function(manId, inf) {
    return manager.findByIdAndUpdate(
      manId,
      { $pull:{ influencers: inf._id }},
      { new: true, useFindAndModify: false }
    );
};
const removemanfrominf=function(infId,man){
    return influencer.findByIdAndUpdate(
       infId,
       {$pull:{managers:man._id}},
       { new: true, useFindAndModify: false}
    )
}
fier=function(manId,id){
 manager.findOne({_id:manId},(err,doc)=>{
    if(err){
        reject(err)
    }else{
        influencer.findOne({_id:id},(error,docu)=>{
            if (error){
                reject(error)
            }else{
               resolve( 
                removeinffromman(manId,docu),
                removemanfrominf(id,doc))
                
            }
           })
    }  
 })
}
module.exports={loginman,updateman,delman,registry,getmanager,getallman,getinfofman,getmanbyid,fier}