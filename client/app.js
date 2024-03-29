window.addEventListener("DOMContentLoaded", loadDataFromStorage);
const userName = document.querySelector(".UserName");
const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("send-btn");
const chatListData = document.getElementById("chat-list-data");
const signOutBtn = document.getElementById("signout-btn");
const fileInput = document.getElementById("formFile");

sendBtn.addEventListener("click", sendMessage);
signOutBtn.addEventListener("click", signOutUser);
const localUserData = localStorage.getItem("User Details");
const token = localStorage.getItem("Authorization");
let lastMsgId = 0;
let chatsLength = 0;

async function loadData() {
  try {
    const allChats = await axios.get("http://localhost:3000/getPublicChats", {
      params: {
        lastMsgId: 0,
      },
      headers: {
        authorization: token,
      },
    });
    chatListData.innerHTML = "";
    lastMsgId = allChats.data.chats.length - 1;
    chatsLength = allChats.data.chats.length;
    const startingMsgId = lastMsgId - 9 > 0 ? lastMsgId - 9 : 0;
    if (lastMsgId > 9)
      allChats.data.chats = allChats.data.chats.slice(
        startingMsgId,
        lastMsgId + 1
      );
    else {
      allChats.data.chats = allChats.data.chats.slice(startingMsgId, 10);
    }
    localStorage.setItem("Chats", JSON.stringify(allChats.data.chats));
    listChats(allChats.data.chats);
  } catch (error) {
    console.log("Error", error.response?.data?.message);
  }
}

function loadDataFromStorage() {
  const userDetails = JSON.parse(localStorage.getItem("User Details"));
  userName.innerText = userDetails.name;
  const allChats = JSON.parse(localStorage.getItem("Chats"));
  if (allChats?.length > 0) {
    listChats(allChats);
  } else {
    loadData();
  }
}

async function parseFile(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.onerror = (err) => {
      reject(false);
    };
    reader.readAsArrayBuffer(file);
  });
}

async function sendMessage() {
  if (fileInput?.files[0]) {
    console.log("fileInput", fileInput.files[0]);
    const file = parseFile(fileInput.files[0]);
    const [mediaStream] = await Promise.all([file]);
    const fileUploaded = await axios.post(
      "http://localhost:3000/storeFileInPublicChat",
      {
        file: mediaStream,
      },
      {
        headers: {
          authorization: token,
        },
      }
    );
    console.log("file uploaded", fileUploaded);
  }
  messageInput.reportValidity();
  if (messageInput.checkValidity()) {
    const message = { text: messageInput.value };
    try {
      const response = await axios.post(
        "http://localhost:3000/sendPublicMessage",
        message,
        {
          headers: {
            authorization: token,
          },
        }
      );
      if (response) {
        messageInput.value = "";
      }
      loadData();
    } catch (error) {
      console.log("Error:", error.response.data.message);
    }
  }
}

async function listChats(chats) {
  chats.forEach((chat) => {
    chatListData.innerHTML += `<li class="list-group-item"><b>${chat.from}:</b> ${chat.text}</li>`;
  });
}

function signOutUser() {
  localStorage.clear();
  location.href = "http://127.0.0.1:5500/chat-app-frontend/index.html";
  token = "";
}

// setInterval(async () => {
//   const response = await axios.get("http://localhost:3000/getPublicChats", {
//     params: {
//       lastMsgId: lastMsgId,
//     },
//     headers: {
//       authorization: token,
//     },
//   });
//   if (response.data.chats.length > chatsLength) {
//     loadData();
//   }
// }, 1000);
