const socket = io(); // 自動的に同一オリジンのsocket.ioサーバーへ接続

const messages = document.getElementById("messages");
const input = document.getElementById("msg");
const button = document.getElementById("send");

button.onclick = () => {
  const text = input.value.trim();
  if (!text) return;
  socket.emit("msg", text);
  input.value = "";
};

socket.on("msg", msg => {
  const div = document.createElement("div");
  div.textContent = msg;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
});
