const chatBox = document.getElementById("chatBox");
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const user = JSON.parse(localStorage.getItem("user"));

if (user.plan !== "premium") {
  alert("Premium subscription required.");
  window.location.href = "premium.html";
}

function addMessage(text, className) {
  const div = document.createElement("div");
  div.classList.add("message", className);
  div.innerText = text;

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// SEND MESSAGE
async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, "user-message");
  userInput.value = "";

const token = localStorage.getItem("token");

const res = await fetch("http://localhost:5000/api/ai/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  },
  body: JSON.stringify({ message }),
});

  const data = await res.json();
  addMessage(data.reply, "ai-message");
}

// LOAD CHAT ON PAGE OPEN
async function loadChat() {
    const token = localStorage.getItem("token");

const res = await fetch(
  "http://localhost:5000/api/ai/history",
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);
  const data = await res.json();

  data.messages.forEach((msg) => {
    addMessage(
      msg.text,
      msg.role === "user" ? "user-message" : "ai-message"
    );
  });
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

loadChat();