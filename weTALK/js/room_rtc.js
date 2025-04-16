const APP_ID = process.env.APP_ID;

let uid = sessionStorage.setItem("uid");
if(!uid) {
    /*this uid ideally needs to be the id which is generated in the db. */
    uid = String(Math.floor(Math.random() * 10000))
    sessionStorage.setItem("uid", uid)
}

let token = null;
let client;

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString);
let roomId = urlParams.get("room")

if(!roomId) {
    roomId = "main"
}

let localTracks = [];
let remoteUsers = {};

async function joinRoomInit() {
    client = AgoraRTC.createClient({mode: "rtc", codec: "vp8"})
    await client.join(APP_ID, roomId, token, uid)

    client.on("user-published", handleUserPublished)
    client.on("user-left", handleUserLeft)

    joinStream()
}

async function joinStream() {
    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks({}, {encoderConfig: {
        width: {min: 640, ideal: 1920, max: 1920},
        height: {min: 480, ideal: 1080, max: 1080}
    }})

    let player = `<div class="video_container" id="user-container-${uid}">
                    <div class="video-player" id="user-${uid}></div>
                  </div>`

    document.getElementById("streams_container").insertAdjacentHTML("beforeend", player)
    document.getElementById(`user-container-${uid}`).addEventListener("click", expandVideoFrame)

    localTracks[1].play(`user-${uid}`)

    await client.publish([localTracks[0], localTracks[1]])
}

async function handleUserPublished(user, mediaType) {
    remoteUsers[user.uid] = user;

    await client.subscribe(user, mediaType)

    let player = document.getElementById(`user-container-${user.uid}`)
    if(player===null) {

        player = `<div class="video_container" id="user-container-${user.uid}">
                    <div class="video-player" id="user-${user.uid}></div>
                  </div>`

    document.getElementById("stream_container").insertAdjacentHTML("beforeend", player)
    document.getElementById(`user-container-${user.uid}`).addEventListener("click", expandVideoFrame)   

    }

    if(displayFrame.style.display) {
        player.style.height = "85px"
        player.style.width = "85px"
    }

    if(mediaType === "video") {
        user.videoTrack.play(`user-${user.uid}`)
    }
    if(mediaType==="audio") {
        user.audioTrack.play()
    }
}

let handleUserLeft = async(user) => {
    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()

    if(userIdInDisplayFrame === `user-container-${user.uid}`) {
        displayFrame.style.display = null;
        
        let videoFrames = document.getElementsByClassName("video__container")

        for (let i=0; videoFrames.length<i; i++) {
            videoFrames[i].style.height = "200px"
            videoFrames[i].style.width = "200px"
        }
    }
}

joinRoomInit();