const { urlencoded } = require('express');
const express =require('express');
const app=express();
const cors =require('cors');
const http=require('http').createServer(app);
var mongoose=require('mongoose');
var infroute=require('./routers/inf');
var Products=require('./routers/Products');
var manager=require('./routers/manager');
var admin=require('./routers/Admin');
const {Server}=require('socket.io')
var session=require('express-session')
var passport=require('passport')
var io = new Server(http,{ cors:{
      origin:'*'
}, })
//const { Server } = require("socket.io");
//let x =true;
//  let numberOfnewman=0
app.use(express.json());
app.use(urlencoded({extended:true}))
// app.use(passport.initialize())
// app.use(passport.session({secret:'keyboard cat'}))
app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Request-Methods','*');
  res.setHeader('Access-Control-Allow-Methods','*')
  res.setHeader('Access-Control-Allow-Headers','*')
  next()
})
mongoose.connect('mongodb://localhost/managment',{useNewUrlParser:true},(err)=>{
    if (err){
        console.log(err)
    }
    else{
        console.log('BD connected')
    }
     })
io.on('connection',(socket)=>{   
     app.set('socketio', io);
     app.use('/image',express.static('uploads'))
     app.use('/',infroute);
     app.use('/',Products);
     app.use('/',manager);
     app.use('/Admin',admin)
     //numberOfnewman++;
     //io.emit('event test',numberOfnewman);
     //console.log('a user connected')
     socket.on('disconnect',()=>{
         //numberOfnewman--;
         //io.emit('event test', numberOfnewman)
        //  console.log('user disconnected')
     })
})
http.listen(3000,()=>{
    console.log('server run in port 3000')
})
