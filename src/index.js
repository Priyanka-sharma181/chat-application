const path = require("path")
const http = require("http")
const Filter = require("bad-words")
const {generateMessage,generateLocationMessage} = require('./utils/messages')
const {addUser,getUser,removeUser,getUsersInRoom}=require("./utils/users")
const socketio = require("socket.io")
const express = require("express")
const app =  express()


const server = http.createServer(app)
const io = socketio(server)

const publicDirectoryPath = path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath))


//  io.on handle all connection, disconnection (events)
io.on('connection', (socket) => {
    console.log('new websocate create');

    // socket.on listen events
    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })
        if (error) {
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
        //  to get all user in room
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
         callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }
        // console.log(user);

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })
    // it will response the sendLocation event 
    socket.on('sendLocation', (coords, callback) => {
        console.log(coords);
        const user = getUser(socket.id)
        io.to(user.room).emit('sendLocation', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
        //    when user left room 
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(3000,()=>{
    console.log("server is listining");
})