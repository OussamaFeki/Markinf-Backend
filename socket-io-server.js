const express =require('express');
const app=express();
const cors=require('cors')
const { Server } = require("socket.io");
let x =true;
const http=require('http').createServer(app);
var passport=require('passport')
 const io = new Server({ cors:{
     origin:'*'
 }, });
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
//     console.log(`data is ${x}`);
//     setTimeout(()=>{
//         sendData(socket);
//     }, 3000);
// }
app.get('/auth/facebook',passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });  
http.listen(3000,()=>{
    console.log('server run in port 3000')
})