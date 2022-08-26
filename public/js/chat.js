//it will handle send event and recived event
const socket = io()

socket.on("countupdated",(count)=>{
    console.log('the count has been updated',count);
})

document.querySelector('#increment').addEventListener('click', ()=>{
    console.log("clicked");
    socket.emit('increment')
})