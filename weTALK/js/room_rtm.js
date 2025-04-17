let handleMemberJoined = async(MemberId) => {
    console.log(`new member joined with member-id: ${MemberId}`)

    addMemberToDom(MemberId)
}

let addMemberToDom = async(MemberId) => {
    let memberWrapper = document.getElementById("member__list")
    let memberItem = `<div class="member__wrapper" id="member__${MemberId}__wrapper">
                        <span class="green__icon"></span>
                        <p class="member_name">${MemberId}</p>
                    </div>`

    memberWrapper.insertAdjacentHTML("beforeend", memberItem)
}

let handleMemberLeft = async(MemberId) => {

    removeMemberFromDom(MemberId)
}

let removeMemberFromDom = async(MemberId) => {
    let memberWrapper = document.getElementById(`member__${MemberId}__wrapper`)
    memberWrapper.remove()
}

let leaveChannel = async() => {
    await channel.leave()
    await rtmClient.logout()
}

window.addEventListener("beforeunload", leaveChannel)