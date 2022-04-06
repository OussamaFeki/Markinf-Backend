var influencer= require('../models/influencers');
var mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
var contr=require('../controle/manager_controle')
var Admin=require('../models/Admin')
var influencer=require('../models/influencers');
const manager = require('../models/managers');
require('dotenv').config();
postNewadmin=function(fullname,email,password,repass,error){
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
                        let newadmin=new Admin({
                            fullname,
                            email,
                            password:new Admin().Hashpass(password)
                        })
                            newadmin.save((err,doc)=>{
                            if (err){
                            
                            reject(err)
                            }
                            else{
                                resolve(doc);
                            
                                }
                              })   
                            }}
                
                        })}})}
            })
           
          
         })
}
getall=function(){
    return new Promise((resolve,reject)=>{
        Admin.find({},(err,doc)=>{
            if(err){
                reject(err)
            }
            else{
               resolve(doc)
            }
        })
    })
}
deleteadmin=function(id){
    return new Promise((resolve,reject)=>{
        Admin.deleteOne({_id:id},(err,doc)=>{
            if (err){
                reject(err)
            }
            else{
                resolve(doc);
                
            }
        })    
    })
}
editadmin=function(id,fullname,email,password){
    return new Promise((resolve,reject)=>{
        Admin.updateOne({_id:id},{fullname,email,password:new Admin().Hashpass(password)},(err,doc)=>{
            if (err){
                reject(err)
            }else{resolve(doc)}
        })
    })
}
var privatekey=process.env.PRIVATE_KEY
login=function(email,password){
    return new Promise((resolve,reject)=>{
        Admin.findOne({email},(err,doc)=>{ 
            if (doc){
                if (Admin().Compass(password,doc.password)){
                 let token= jwt.sign({
                      fullname:doc.fullname,
                      id:doc._id,
                      role:'admin' 
                  },privatekey,{expiresIn:'10d'})
                  resolve({token:token}) ;

                }else{
               reject('this email or password is incorrect') }          
            }else{ reject('this email or password is incorrect')
            }
        })
        
    })
}
search=function(fullname){
    return new Promise((resolve,reject)=>{
        Admin.find({fullname},(err,doc)=>{
            if(err){
                reject(err)
            }else{
                resolve(doc)
            }
        })
    })
}
module.exports={getall,postNewadmin,deleteadmin,editadmin,login,search}