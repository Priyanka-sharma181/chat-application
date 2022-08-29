const path = require("path")
const http = require("http")
const Filter = require("bad-words")
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
    socket.on('sendMessage',(message,callback)=>{
        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback("profinity is not allowed")
        }
        io.emit('message',message)
        callback("Deleverd !")
    })
    socket.on("sendLocation",(coords,callback)=>{
        io.emit('message',`https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
       callback()
    })
    socket.on('disconnect',()=>{ 
        io.emit('message','A user has left')
    })
 });


server.listen(3000,()=>{
    console.log("server is listining");
})