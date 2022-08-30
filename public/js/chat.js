
const socket = io()
// Element

const $messageForm = document.querySelector("#message-form")
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector("#send-location")
const $message = document.querySelector("#message")
// for randering msg 
const $messageTemplate = document.querySelector("#message-template").innerHTML
const $messageSendLocation = document.querySelector("#location-template").innerHTML

socket.on("message",(message)=>{
    const html = Mustache.render($messageTemplate,{
        message
    })
    $message.insertAdjacentHTML('beforeend',html)
})
// response location msg
socket.on('sendLocation',(url)=>{
    const html = Mustache.render($messageSendLocation,{
        url
    })
    $message.insertAdjacentHTML('beforeend',html)
})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    // for disable  button
   $messageFormButton.setAttribute('disabled','disabled')

    const message = e.target.elements.message.value
    socket.emit('sendMessage',message,(error)=>{
        // for unable  or clear input 
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if(error){
          return  console.log(error);
        }
        console.log("this msg was delevired", message);
    })
})

// for location 

$sendLocationButton.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert("know your location")
    }
    $sendLocationButton.setAttribute("disabled","disabled")
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit("sendLocation",{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            $sendLocationButton.removeAttribute("disabled")
            console.log("location shared");
        })
    })
})