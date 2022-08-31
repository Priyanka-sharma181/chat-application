const socket = io()
// Element

const $messageForm = document.querySelector("#message-form")
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector("#send-location")
const $message = document.querySelector("#messages")
const $sidebarTemplate = document.querySelector("#sidebar-template").innerHTML
// for randering msg 
const $messageTemplate = document.querySelector("#message-template").innerHTML
const $messageSendLocation = document.querySelector("#location-template").innerHTML
// option 
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})







// event for msg 
socket.on("message",(message)=>{
    const html = Mustache.render($messageTemplate,{
        username:message.username,
        message :message.text,
        createdAt:moment(message.createdAt).format("h:mm a")
    })
    $message.insertAdjacentHTML('beforeend',html)
})
// event for location 
socket.on('sendLocation',(message)=>{
    const html = Mustache.render($messageSendLocation,{
        username:message.username,
        url:message.url,
        createdAt:moment(message.createdAt).format("h:mm a")

    })
    console.log(message);
    $message.insertAdjacentHTML('beforeend',html)
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render($sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
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

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})