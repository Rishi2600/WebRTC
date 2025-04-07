let localStream;
let remoteStream;
let peerConnection;

async function init() {
    localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
    document.getElementById("user-1").srcObject = localStream;

    createOffer();
}

async function createOffer() {
    peerConnection = new RTCPeerConnection();

    remoteStream = new MediaStream();
    document.getElementById("user-2").srcObject = remoteStream;

    let offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer);

    console.log(offer);
}

init();