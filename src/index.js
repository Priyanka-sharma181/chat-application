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
    socket.emit("msg","welcome!")

    socket.broadcast.emit('message','A user has joined')
    socket.on('sendMessage',(message)=>{
        io.emit('message',message)
    })
    socket.on('disconnect',()=>{
        io.emit
    })
 });
server.listen(3000,()=>{
    console.log("server is listining");
})