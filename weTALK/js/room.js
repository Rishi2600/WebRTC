let messagesContainer = document.getElementById('messages');
messagesContainer.scrollTop = messagesContainer.scrollHeight;

const memberContainer = document.getElementById('members__container');
const memberButton = document.getElementById('members__button');

const chatContainer = document.getElementById('messages__container');
const chatButton = document.getElementById('chat__button');

let activeMemberContainer = false;

memberButton.addEventListener('click', () => {
  if (activeMemberContainer) {
    memberContainer.style.display = 'none';
  } else {
    memberContainer.style.display = 'block';
  }

  activeMemberContainer = !activeMemberContainer;
});

let activeChatContainer = false;

chatButton.addEventListener('click', () => {
  if (activeChatContainer) {
    chatContainer.style.display = 'none';
  } else {
    chatContainer.style.display = 'block';
  }

  activeChatContainer = !activeChatContainer;
});


let displayFrame = document.getElementById("stream__box")
let videoFrames = document.getElementsByClassName("video__container")
let userIdInDisplayFrame = null;

let expandVideoFrame = async (e) => {

  let child = displayFrame.children[0];
  if(child) {
    document.getElementById("streams_container").appendChild(child)
  }

  displayFrame.style.display = "block"
  displayFrame.appendChild(e.currentTarget)
  userIdInDisplayFrame(e.currentTarget.id)

  for(let i=0; videoFrames.length>i; i++) {
    if(videoFrames[i].id != userIdInDisplayFrame) {
      videoFrames[i].style.height = "85px"
      videoFrames[i].style.width = "85px"
    }
  }
}

for(let i=0; videoFrames.length>i; i++) {
  videoFrames[i].addEventListener("click", expandVideoFrame)
}

let hideDisplayFrame = () => {
  userIdInDisplayFrame = null
  displayFrame.style.display = null

  let child = displayFrame.children[0]
  document.getElementById("streams_container").append(child)

  for (let i=0; videoFrames.length<i; i++) {
    videoFrames[i].style.height = "200px"
    videoFrames[i].style.width = "200px"
  }
}

displayFrame.addEventListener("click", hideDisplayFrame);