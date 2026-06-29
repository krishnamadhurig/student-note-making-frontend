console.log(
  "CHAT.JS STABLE VERSION",
  new Date().toLocaleTimeString()
);

const socket = io("http://localhost:5000");

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

const user = JSON.parse(localStorage.getItem("user"));

socket.emit("userOnline", user.username);

/* =========================
   GLOBAL STATE (IMPORTANT FIX)
========================= */
let currentGroup = null;

/* =========================
   DOM
========================= */
const groupSelect = document.getElementById("groupSelect");
const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

/* debug */
setInterval(() => {
  console.log("CURRENT GROUP:", currentGroup);
}, 2000);

/* =========================
   INIT
========================= */
loadGroups();

/* =========================
   ONLY ROOM JOIN HANDLER
========================= */
groupSelect.addEventListener("change", () => {
  currentGroup = groupSelect.value;

  socket.emit("joinGroup", currentGroup);
  loadMessages();
});

/* =========================
   LOAD GROUPS (UI ONLY)
========================= */
async function loadGroups() {
  try {
    const response = await fetch("http://localhost:5000/api/groups", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const groups = await response.json();

    groupSelect.innerHTML = "";

    groups.forEach(group => {
      const option = document.createElement("option");
      option.value = group.groupName;
      option.textContent = group.groupName;
      groupSelect.appendChild(option);
    });

    if (groups.length) {
      if (!currentGroup) {
        currentGroup = groups[0].groupName;
      }

      groupSelect.value = currentGroup;
    }

  } catch (error) {
    console.log(error);
  }
}

/* =========================
   CREATE GROUP (SAFE)
========================= */
document.getElementById("createGroupBtn")
  .addEventListener("click", createGroup);

async function createGroup() {
  const groupName = document.getElementById("groupName").value.trim();
  if (!groupName) return;

  try {
    await fetch("http://localhost:5000/api/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ groupName })
    });

    document.getElementById("groupName").value = "";

    currentGroup = groupName;

    await loadGroups();

    groupSelect.value = groupName;

    socket.emit("joinGroup", groupName);
    loadMessages();

  } catch (error) {
    console.log(error);
  }
}

/* =========================
   SEND MESSAGE
========================= */
sendBtn.addEventListener("click", sendMessage);

messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const text = messageInput.value.trim();
  const file = document.getElementById("chatFile").files[0];

  if (!text && !file) return;

  let fileUrl = null;

  try {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "http://localhost:5000/api/chat/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      );

      const data = await response.json();
      fileUrl = data.fileUrl;
    }

    socket.emit("sendMessage", {
      userId: user._id,
      username: user.username,
      groupName: currentGroup,
      message: text,
      fileUrl
    });

    messageInput.value = "";
    document.getElementById("chatFile").value = "";

  } catch (error) {
    console.log(error);
  }
}

/* =========================
   RECEIVE MESSAGE
========================= */
socket.on("receiveMessage", (data) => {
  if (data.groupName !== currentGroup) return;

  const time = new Date(data.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  const ownMessage = String(data.userId) === String(user._id);

  chatBox.innerHTML += `
    <div class="chat-message ${ownMessage ? "own" : "other"}">
      <strong>${data.username}</strong>
      <p>${data.message || ""}</p>

      ${
        data.fileUrl
          ? `<a href="http://localhost:5000/uploads/${data.fileUrl}" target="_blank">
              📎 View File
            </a>`
          : ""
      }

      <small>${time}</small>
    </div>
  `;

  chatBox.scrollTop = chatBox.scrollHeight;
});

/* =========================
   LOAD MESSAGES
========================= */
async function loadMessages() {
  try {
    const response = await fetch(
      `http://localhost:5000/api/chat/${currentGroup}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const messages = await response.json();

    chatBox.innerHTML = "";

    messages.forEach((msg) => {
      const time = new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });

      const ownMessage = String(msg.userId) === String(user._id);

      chatBox.innerHTML += `
        <div class="chat-message ${ownMessage ? "own" : "other"}">
          <strong>${msg.username}</strong>
          <p>${msg.message || ""}</p>

          ${
            msg.fileUrl
              ? `<a href="http://localhost:5000/uploads/${msg.fileUrl}" target="_blank">
                  📎 View File
                </a>`
              : ""
          }

          <small>${time}</small>
        </div>
      `;
    });

    chatBox.scrollTop = chatBox.scrollHeight;

  } catch (error) {
    console.log(error);
  }
}

/* =========================
   ONLINE USERS
========================= */
socket.on("onlineUsers", (users) => {
  const onlineBox = document.getElementById("onlineUsers");

  onlineBox.innerHTML = users
    .map(u => `<p>🟢 ${u}</p>`)
    .join("");
});

/* =========================
   TYPING
========================= */
messageInput.addEventListener("input", () => {
  socket.emit("typing", {
    username: user.username,
    groupName: currentGroup
  });
});

socket.on("userTyping", (username) => {
  if (username === user.username) return;

  const typingBox = document.getElementById("typingStatus");

  typingBox.innerText = `${username} is typing...`;

  setTimeout(() => {
    typingBox.innerText = "";
  }, 1500);
});