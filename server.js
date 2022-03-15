const { urlencoded } = require('express');
const express =require('express');
const app=express();
var mongoose=require('mongoose');
var infroute=require('./routers/inf');
var Products=require('./routers/Products');
var manager=require('./routers/manager');
var admin=require('./routers/Admin');

mongoose.connect('mongodb://localhost/managment',{useNewUrlParser:true},(err)=>{
    if (err){
        console.log(err)
    }else{
        console.log('BD connected')
    }
})
app.use(express.json());
app.use(urlencoded({extended:true}))
app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Request-Methods','*');
  res.setHeader('Access-Control-Allow-Methods','*')
  res.setHeader('Access-Control-Allow-Headers','*')
  next()
})

app.use('/',infroute);
app.use('/',Products);
app.use('/',manager);
app.use('/Admin',admin)
app.listen(3000,()=>{console.log('server run in port 3000')})