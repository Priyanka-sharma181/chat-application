const socket = io()

socket.on("message",(message)=>{
    console.log(message);
})

document.querySelector('#message-form').addEventListener('submit',(e)=>{
    e.preventDefault()
    const message = e.target.elements.message.value
    socket.emit('sendMessage',message,(error)=>{
        if(error){
          return  console.log(error);
        }
        console.log("this msg was delevired", message);
    })
})

// for location 

document.querySelector("#send-location").addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert("know your location")
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit("sendLocation",{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            console.log("location shared");
        })
    })
})