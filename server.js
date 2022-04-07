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
var io = new Server(http,{ cors:{
      origin:'*'
}, })
//const { Server } = require("socket.io");
//let x =true;
//  let numberOfnewman=0
app.use(express.json());
app.use(urlencoded({extended:true}))
app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Request-Methods','*');
  res.setHeader('Access-Control-Allow-Methods','*')
  res.setHeader('Access-Control-Allow-Headers','*')
  next()
})
io.on('connection',(socket)=>{
    mongoose.connect('mongodb://localhost/managment',{useNewUrlParser:true},(err)=>{
    if (err){
        console.log(err)
    }
    else{
        console.log('BD connected')
    }
     })
     app.set('socketio', io);
     app.use('/image',express.static('uploads'))
     app.use('/',infroute);
     app.use('/',Products);
     app.use('/',manager);
     app.use('/Admin',admin)
     //numberOfnewman++;
     //io.emit('event test',numberOfnewman);
     console.log('a user connected')
     socket.on('disconnect',()=>{
         //numberOfnewman--;
         //io.emit('event test', numberOfnewman)
         console.log('user disconnected')
     })
})

//const io = new Server({ cors:{
  //  origin:'*'
//}, });

// io.on('connection',(socket)=>{
//     console.log(`connected`);
//     sendData(socket);
// })
// function sendData(socket){
//     if(x){
//         socket.emit('data1','this is data 1 ');
//         x=!x;
//     }else{
//         socket.emit('data2','this is  data2');
//         x= !x;
//     }
//     setTimeout(()=>{
//         sendData(socket);
//     }, 3000);
// }
// mongoose.connect('mongodb://localhost/managment',{useNewUrlParser:true},(err)=>{
//     if (err){
//         console.log(err)
//     }else{
//         console.log('BD connected')
//     }
// })
//app.set('socketio', io);
// const webpush = require('web-push');
// const { disconnect } = require('process');
// console.log(webpush.generateVAPIDKeys())
// const publicKey='BGJ-CeeAqtlJSOz9bauqKeGDlCERSp7qSvXweUIogxJBSOipZ2DD0vy3TOkgfhVPpK7yCh1mcwhKJcC60exyEA0'
// const privateKey='3Cx1ovUyBR8Qpqkz9gm08dZ_lrSbi8Pu9o0gO1yeLOw' 

// app.use('/image',express.static('uploads'))
// app.use('/',infroute);
// app.use('/',Products);
// app.use('/',manager);
// app.use('/Admin',admin)
http.listen(3000,()=>{
    console.log('server run in port 3000')
})
