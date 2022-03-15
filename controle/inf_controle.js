var influencer= require('../models/influencers');
var mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
var contr=require('../controle/manager_controle')
var manager=require('../models/managers');
var Admin=require('../models/Admin');
const Newman=require('../models/Newman')
var newinf=require('../controle/newinf_cont')
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
                            image:"assets/admin/img/undraw_profile.svg"
                        }) 
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
search=function(fullname){
    return new Promise((resolve,reject)=>{
        influencer.find({fullname},(err,doc)=>{
            if(err){
                reject(err)
            }else{
                resolve(doc)
            }
        })
    })
}
module.exports={getall,postNewInf,deleteinf,editinf,login,search}