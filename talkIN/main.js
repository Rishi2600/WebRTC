const APP_ID = process.env.APP_ID

let token = null;
let uid = string(Math.floor(Math.random() * 10000));

let client;
let channel;

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
    /*signaling server using agora but can be done manually too. */
    client = await AgoraRTC.createInstance(APP_ID)
    await client.login({uid, token}) 

    channel = client.createChannel("main");
    await channel.join()

    channel.on("MemberJoined", handleUserJoined)

    client.on("MessageFromPeer", handleMessageFromPeer)

    /*setting localStream. */
    localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
    document.getElementById("user-1").srcObject = localStream;

}

async function handleMessageFromPeer(message, MemberId) {
    message = JSON.parse(message.text)
    console.log(`Message ${message} from the member with id: ${MemberId}`)
}

async function handleUserJoined(MemberId) {
    console.log(MemberId)

    createOffer(MemberId);
}

async function createOffer(MemberId) {
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

    /*creating new ice candidate when an offer is created. */
    peerConnection.onicecandidate = async(event) => {
        if(event.candidate) {
            console.log(event.candidate)
        }
    }

    /*creating peerConnection --offer. */
    let offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer);

    console.log(offer);

    client.sendMessageToPeer(JSON.stringify({"type": "offer", "offer": offer}), MemberId)
}

init();