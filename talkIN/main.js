let localStream;
let remoteStream;

async function init() {
    localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
    document.getElementById("user-1").srcObject = localStream;
}

init();