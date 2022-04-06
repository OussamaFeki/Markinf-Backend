const express =require('express');
const app=express();
const cors=require('cors')
const { Server } = require("socket.io");
let x =true;

const io = new Server({ cors:{
    origin:'*'
}, });
io.on('connection',(socket)=>{
    console.log(`connected`);
    sendData(socket);
})
function sendData(socket){
    if(x){
        socket.emit('data1','this is data 1 ');
        x=!x;
    }else{
        socket.emit('data2','this is  data2');
        x= !x;
    }
    console.log(`data is ${x}`);
    setTimeout(()=>{
        sendData(socket);
    }, 3000);
}
io.listen(3200,()=>{
    console.log('server socket run in 3100')
})