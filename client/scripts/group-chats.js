// window.addEventListener("DOMContentLoaded", loadGroupData);
const token = localStorage.getItem("Authorization");

const userName = document.querySelector(".UserName");
const groupNameListEle = document.querySelector(".group-chat-names");
const createGroupBtn = document.getElementById("create-group-btn");
const groupChatModal = document.getElementById("groupChatModal");
const groupChatModalTitle = document.getElementById("groupModalLabel");
const groupChatModalBodyHeader = document.querySelector(".modal-body-header");
const groupChatModalBody = document.querySelector(".modal-body");
const inviteMembersBtn = document.querySelector(".invite-btn");
const membersListBtn = document.querySelector(".members-list-btn");
const groupChatList = document.getElementById("group-chat-data");
const sendMsgBtn = document.getElementById("send-btn");
const groupMsgInput = document.getElementById("group-message");
const signOutBtn = document.getElementById("signout-btn");

let groupNameInput;
let groupId;
let searchMemberInput;

sendMsgBtn.addEventListener("click", sendGroupMessage);
createGroupBtn.addEventListener("click", createGroup);
signOutBtn.addEventListener("click", signOutUser);

async function createGroup() {
  groupNameInput.reportValidity();
  if (groupNameInput.checkValidity()) {
    try {
      const groupName = groupNameInput.value;
      const newGroup = await axios.post(
        "http://localhost:3000/createGroup",
        {
          name: groupName,
        },
        {
          headers: {
            authorization: token,
          },
        }
      );
      groupNameInput.value = "";
      hideModal();
      loadGroupData();
    } catch (error) {
      console.log("Error:", error);
    }
  }
}
//loading data on reload
async function loadGroupData() {
  const userDetails = JSON.parse(localStorage.getItem("User Details"));
  userName.innerText = userDetails.name;
  groupNameListEle.innerHTML = `<button type="button" data-bs-toggle="modal" data-bs-target="#groupChatModal" data-bs-title="createGroup" class="btn btn-primary group-btn">Create Group</button><button type="button" data-bs-toggle="modal" data-bs-target="#groupChatModal" data-bs-title="pendingRequests" class="btn btn-warning group-btn">Pending Requests</button>`;
  try {
    const groupNameList = await axios.get(
      "http://localhost:3000/getGroupNameListing",
      {
        headers: {
          authorization: token,
        },
      }
    );
    for (group of groupNameList.data.groupNameList) {
      groupNameListEle.innerHTML += `<button type="button" onclick="fetchGroupData(${group.groupId})" class="btn btn-outline-primary group-btn">${group.groupName}</button>`;
    }
  } catch (error) {
    console.log("Error:", error);
  }
}
//load modal content
groupChatModal.addEventListener("show.bs.modal", async (event) => {
  const button = event.relatedTarget;
  const buttonTitle = button.getAttribute("data-bs-title");
  console.log("btn title", buttonTitle);
  if (buttonTitle == "createGroup") {
    groupChatModalTitle.innerText = "Create New Group";
    groupChatModalBody.innerHTML = `<form>
    <div class="mb-3">
      <label for="group-name" class="col-form-label"
        >Group Name:</label
      >
      <input
        type="text"
        class="form-control"
        id="group-name"
        required
      />
    </div>
  </form>`;
    groupNameInput = document.getElementById("group-name");
  } else if (buttonTitle == "inviteMembers") {
    groupChatModalTitle.innerText = "Invite members to this group";
    groupChatModalBodyHeader.style.display = "block";
    // groupChatModalBody.innerHTML = `
    // <input id="search-member-list" type="text">Search</input>`;
    getUsersForInviteReq();
  } else if (buttonTitle == "pendingRequests") {
    try {
      const pendingRequestsRes = await axios.get(
        `http://localhost:3000/getGroupInvites`,
        {
          headers: {
            authorization: token,
          },
        }
      );
      pendingGroupRequests = pendingRequestsRes.data.requests;
      groupChatModalTitle.innerText = "Invite requests";
      groupChatModalBody.innerHTML = "";
      pendingGroupRequests.forEach((listMember) => {
        groupChatModalBody.innerHTML += `<ul class="list-group">
        <li class="list-group-item members-list"><div>${listMember.groupName}</div>
        <div>
        <button id="accept-invite-btn-${listMember.id}" type="button" onclick="acceptInvite('${listMember.id}', ${listMember.groupId})" class="btn btn-success btn-sm">Accept</button>
        <button id="reject-invite-btn-${listMember.id}" type="button" onclick="rejectInvite('${listMember.id}', ${listMember.groupId})" class="btn btn-danger btn-sm">Reject</button>
        <span id="invite-req-res-${listMember.id}" style="display:none"></span>
        </div>
        </li>
        </ul>`;
      });
      if (pendingGroupRequests.length == 0) {
        groupChatModalBody.innerHTML = "<b>No new requests</b>";
      }
    } catch (error) {
      console.log("Error:", error);
    }
  } else if (buttonTitle == "membersList") {
    try {
      const groupMembersRes = await axios.get(
        `http://localhost:3000/getGroupMembers/${groupId}`,
        {
          headers: {
            authorization: token,
          },
        }
      );
      groupMembers = groupMembersRes.data.members;
      console.log("grup membersss", groupMembers);
      groupChatModalTitle.innerText = "Members list";
      groupChatModalBody.innerHTML = "";
      groupMembers.forEach((listMember) => {
        if (listMember.admin != listMember.userId) {
          groupChatModalBody.innerHTML += `<ul class="list-group">
        <li class="list-group-item members-list"><div>${listMember.user.name}-${listMember.user.email}</div>
        <div><button id="make-admin-btn-${listMember.id}" type="button" onclick="makeAdmin('${listMember.userId}',${listMember.id})" class="btn btn-warning btn-sm">Make admin</button>
        <button id="remove-member-btn-${listMember.id}" type="button" onclick="removeMember(${listMember.id})" class="btn btn-danger btn-sm">Remove</button>
        <span id="member-action-res-${listMember.id}" style="display:none"></span></div>
        </li>
        </ul>`;
        } else {
          groupChatModalBody.innerHTML += `<ul class="list-group">
        <li class="list-group-item members-list"><div>${listMember.user.name}-${listMember.user.email}</div>
        <div>
        <button id="remove-member-btn-${listMember.id}" type="button" onclick="removeMember(${listMember.id})" class="btn btn-danger btn-sm">Remove</button>
        <span id="member-action-res-${listMember.id}" style="display:none"></span></div>
        </li>
        </ul>`;
        }
      });
      if (groupMembers.length == 0) {
        groupChatModalBody.innerHTML = "<b>No members in the group</b>";
      }
    } catch (error) {
      console.log("Error:", error);
    }
  }
});

groupChatModal.addEventListener("hide.bs.modal", async (event) => {
  groupChatModalBodyHeader.style.display = "none";
});

async function getUsersForInviteReq(searchQuery) {
  try {
    const userListForInviteRes = await axios.get(
      `http://localhost:3000/getUsersForInvite/${groupId}`,
      {
        params: {
          search: searchQuery,
        },
        headers: {
          authorization: token,
        },
      }
    );
    userListForInvite = userListForInviteRes.data.userList;
    groupChatModalBody.innerHTML = "";
    userListForInvite.forEach((listMember) => {
      groupChatModalBody.innerHTML += `
      <ul class="list-group">
      <li class="list-group-item members-list">${listMember.name}-${listMember.email}-${listMember.phone}<button id="send-invite-btn-${listMember.id}" type="button" onclick="sendInvite('${listMember.id}', ${groupId})" class="btn btn-primary btn-sm">Send</button>
      <span id="invite-res-${listMember.id}" style="color:green; display:none">Sent</span>
      </li>
      </ul>`;
    });
    if (userListForInvite.length == 0) {
      groupChatModalBody.innerHTML = "<b>No members to invite</b>";
    }
  } catch (error) {
    console.log("Error:", error);
  }

  searchMemberInput = document.getElementById("search-member-list");
  searchMemberInput?.addEventListener("keyup", searchMembersList);
}

async function searchMembersList() {
  const searchQuery = searchMemberInput.value;
  console.log("key pressed", searchMemberInput.value);
  getUsersForInviteReq(searchQuery);
}

async function fetchGroupData(gId) {
  inviteMembersBtn.style.display = "block";
  membersListBtn.style.display = "block";
  groupId = gId;
  try {
    const getGroupChatsRes = await axios.get(
      `http://localhost:3000/getGroupChats/${gId}`,
      {
        headers: {
          authorization: token,
        },
      }
    );
    const groupChatData = getGroupChatsRes.data.groupChats;
    groupChatList.innerHTML = "";
    groupChatData.forEach((groupMsg) => {
      groupChatList.innerHTML += `<li class="list-group-item"><b>${groupMsg.from}</b>:${groupMsg.text}</li>`;
    });
  } catch (error) {
    console.log("Error:", error);
  }
}

async function sendInvite(uId, gId) {
  try {
    const sendInviteRes = await axios.get(
      `http://localhost:3000/sendGroupInvite/${uId}/${gId}`,
      {
        headers: {
          authorization: token,
        },
      }
    );
    const inviteReqRes = document.getElementById(`invite-res-${uId}`);
    const sendInviteBtn = document.getElementById(`send-invite-btn-${uId}`);
    inviteReqRes.style.display = "block";
    sendInviteBtn.style.display = "none";
  } catch (error) {
    console.log("Error:", error);
  }
}

async function acceptInvite(uId, gId) {
  try {
    const acceptInviteRes = await axios.get(
      `http://localhost:3000/acceptGroupInvite/${gId}`,
      {
        headers: {
          authorization: token,
        },
      }
    );
    const acceptedText = document.getElementById(`invite-req-res-${uId}`);
    const acceptReqBtn = document.getElementById(`accept-invite-btn-${uId}`);
    const rejectReqBtn = document.getElementById(`reject-invite-btn-${uId}`);
    acceptedText.innerText = "Accepted";
    acceptedText.style.color = "green";
    acceptedText.style.display = "block";
    acceptReqBtn.style.display = "none";
    rejectReqBtn.style.display = "none";
    loadGroupData();
  } catch (error) {
    console.log("Error:", error);
  }
}

async function makeAdmin(uId, uGId) {
  try {
    const makeAdminRes = await axios.get(
      `http://localhost:3000/makeAdmin/${uGId}/${uId}`,
      {
        headers: {
          authorization: token,
        },
      }
    );
    const adminText = document.getElementById(`member-action-res-${uGId}`);
    const makeAdminBtn = document.getElementById(`make-admin-btn-${uGId}`);
    const removeMemberBtn = document.getElementById(
      `remove-member-btn-${uGId}`
    );
    adminText.innerText = "Admin";
    adminText.style.color = "green";
    adminText.style.display = "block";
    makeAdminBtn.style.display = "none";
    removeMemberBtn.style.display = "none";
    loadGroupData();
  } catch (error) {
    console.log("Error:", error);
  }
}

async function removeMember(uGId) {
  try {
    const removeMemberRes = await axios.get(
      `http://localhost:3000/removeMember/${uGId}`,
      {
        headers: {
          authorization: token,
        },
      }
    );
    const removeMemberText = document.getElementById(
      `member-action-res-${uGId}`
    );
    const removeMemberBtn = document.getElementById(
      `remove-member-btn-${uGId}`
    );
    removeMemberText.innerText = "Removed";
    removeMemberText.style.color = "red";
    removeMemberText.style.display = "block";
    removeMemberBtn.style.display = "none";
    loadGroupData();
  } catch (error) {
    console.log("Error:", error);
  }
}

async function rejectInvite(uId, gId) {
  try {
    const rejectInviteRes = await axios.get(
      `http://localhost:3000/rejectGroupInvite/${gId}`,
      {
        headers: {
          authorization: token,
        },
      }
    );
    const rejectedText = document.getElementById(`invite-req-res-${uId}`);
    const acceptReqBtn = document.getElementById(`accept-invite-btn-${uId}`);
    const rejectReqBtn = document.getElementById(`reject-invite-btn-${uId}`);
    rejectedText.innerText = "Rejected";
    rejectedText.style.color = "red";
    rejectedText.style.display = "block";
    acceptReqBtn.style.display = "none";
    rejectReqBtn.style.display = "none";
    loadGroupData();
  } catch (error) {
    console.log("Error:", error);
  }
}

async function sendGroupMessage() {
  const message = groupMsgInput.value;
  try {
    const sendGroupMsgRes = await axios.post(
      `http://localhost:3000/sendGroupMessage/${groupId}`,
      {
        text: message,
      },
      {
        headers: {
          authorization: token,
        },
      }
    );
    groupMsgInput.value = "";
    fetchGroupData(groupId);
    // loadGroupData();
  } catch (error) {
    console.log("Error:", error);
  }
}
function signOutUser() {
  localStorage.clear();
  location.href = "http://127.0.0.1:5500/chat-app-frontend/index.html";
  token = "";
}

// setInterval(async () => {
//   if (groupId) {
//     const response = await axios.get(
//       `http://localhost:3000/getGroupChats/${groupId}`,
//       {
//         // params: {
//         //   lastMsgId: lastMsgId,
//         // },
//         headers: {
//           authorization: token,
//         },
//       }
//     );
//     // if (response.data.chats.length > chatsLength) {
//     fetchGroupData(groupId);
//     // }
//   }
// }, 2000);
