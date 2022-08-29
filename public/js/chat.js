const socket = io()

socket.on("msg",(message)=>{
    console.log("welcome !");
})

document.querySelector('#message-form').addEventListener('submit',(e)=>{
    e.preventDefault()
    const message = e.target.elements.message.value
    socket.emit('sendMessage',message)
})