const socket = io("/")

const videoGrid = document.getElementById("video-grid") 
const myPeer = new Peer(undefined, {
    host: "/",
    port: "3001"
})

const myVideo = document.addEventListener(("video"))
myVideo.mute = true;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then( stream => {
    addVideoStream(myVideo, stream)
})

myPeer.on("open", id => {
    socket.emit("join-room", ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
    const call = myP
}

socket.on("user-connected", userId => {
    console.log("user-connected" + userId)
})

const addVideoStream = (video, stream) => {
    video.srcObject = stream

    video.addEventListener("loadedMetaData", () => {
        video.play()
    })
    videoGrid.append(video)
}