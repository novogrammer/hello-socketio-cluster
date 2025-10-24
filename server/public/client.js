const socket = io(); // 自動的に同一オリジンのsocket.ioサーバーへ接続

const messages = document.getElementById("messages");
const input = document.getElementById("msg");
const button = document.getElementById("send");

const sendMessage = () => {
  const text = input.value.trim();
  if (!text) return;
  socket.emit("msg", text);
  input.value = "";
};

button.onclick = sendMessage;

input.addEventListener("keydown", event => {
  if (event.isComposing || event.key === "Process" || event.keyCode === 229) {
    // Ignore Enter while IME composition is active
    return;
  }
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});

socket.on("msg", msg => {
  const div = document.createElement("div");
  div.textContent = msg;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
});
