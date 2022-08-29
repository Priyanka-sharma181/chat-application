const path = require("path")
const http = require("http")
const socketio = require("socket.io")
const express = require("express")
const app =  express()
const server = http.createServer(app)
const io = socketio(server)
const publicDirectoryPath = path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) => {
    console.log('new websocate create');
    socket.emit("message","welcome!")

socket.broadcast.emit('message','A user has joined')
    socket.on('sendMessage',(message)=>{
        io.emit('message',message)
    })
    socket.on("sendLocation",(coords)=>{
        io.emit('message',`https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
    })
    socket.on('disconnect',()=>{ 
        io.emit('message','A user has left')
    })
 });


server.listen(3000,()=>{
    console.log("server is listining");
})