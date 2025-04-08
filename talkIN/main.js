let localStream;
let remoteStream;
let peerConnection;

const servers = {
    iceServers: [
        {
            urls: ["stun: stun1.1.google.com:19032", "stun: stun2.1.google.com:19032"]
        }
    ]
}

async function init() {
    /*setting localStream. */
    localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
    document.getElementById("user-1").srcObject = localStream;

    createOffer();
}

async function createOffer() {
    /*establishing peerConnection. */
    peerConnection = new RTCPeerConnection(servers);

    /*setting remoteStream. */
    remoteStream = new MediaStream();
    document.getElementById("user-2").srcObject = remoteStream;

    /*taking the tracks from the localStream and putting it into the peerConnection so that the remoteStream can access it. */
    localStream.getTracks().forEach((tracks) => {
        peerConnection.addTracks(tracks, localStream)
    });

    peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track)
        })
    }

    /*creating peerConnection --offer. */
    let offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer);

    console.log(offer);
}

init();