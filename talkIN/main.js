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

    /*creating the answer at localPeer if the message from remotePeer is an offer. */
    if(message.type === "offer") {
        createAnswer(MemberId, message.offer)
    }

    /*adding the answer at localPeer if the message from remotePeer is an answer. */
    if(message.type === "answer") {
        addAnswer(message.answer)
    }

    /*adding an IceCandidate at localPeer if the message from remotePeer is an IceCandidate */
    if(message.type === "candidate") {
        if(peerConnection) {
            peerConnection.addIceCandidate(message.candidate)
        }
    }
}

async function handleUserJoined(MemberId) {
    console.log(MemberId)

    await createOffer(MemberId);
}

async function createPeerConnection(MemberId) {
    /*establishing peerConnection. */
    peerConnection = new RTCPeerConnection(servers);

    /*setting remoteStream. */
    remoteStream = new MediaStream();
    document.getElementById("user-2").srcObject = remoteStream;

    /*taking the tracks from the localStream and putting it into the peerConnection so that the remoteStream can access it. */
    if(!localStream) {
        localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
        document.getElementById("user-1").srcObject = localStream;
    }
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
            // console.log(event.candidate)
            client.sendMessageToPeer(JSON.stringify({"type": "candidate", "candidate": event.candidate}), MemberId)
        }
    }
}

async function createOffer(MemberId) {

    await createPeerConnection(MemberId);
   
    /*creating peerConnection --offer. */
    let offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer);

    console.log(offer);

    client.sendMessageToPeer(JSON.stringify({"type": "offer", "offer": offer}), MemberId)
}

async function createAnswer(MemberId, offer) {

    await createPeerConnection(MemberId);

    /*creating peerConnection --answer. */
    await peerConnection.remoteDescription(offer);

    let answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer);

    client.sendMessageToPeer(JSON.stringify({"type": "answer", "answer": answer}), MemberId)

}

let = addAnswer = async (answer) => {
    if(!peerConnection.currentRemoteDescription) {
        peerConnection.setRemoteDescription(answer)
    }
}

init();