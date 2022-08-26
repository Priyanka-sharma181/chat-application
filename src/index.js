const path = require("path")
const http = require("http")
const socketio = require("socket.io")
const express = require("express")
const app =  express()
const server = http.createServer(app)
const io = socketio(server)
const publicDirectoryPath = path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath))

let count = 0
io.on('connection', (socket) => {
    console.log('new websocate create');
    socket.emit("countupdated",count) 
    socket.on('increment',()=>{
        count ++
        io.emit('countupdated',count)
    })
    
 });
server.listen(3000,()=>{
    console.log("server is listining");
})