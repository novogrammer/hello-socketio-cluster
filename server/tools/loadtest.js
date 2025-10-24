import io from "socket.io-client"

const URL = "http://localhost:8080/"
const CLIENTS = 100
const INTERVAL = 100  // ms

const MESSAGE_QTY = 100;

console.log("start")
let doneCount = 0;
for (let i = 0; i < CLIENTS; i++) {
  console.log("start each")
  const socket = io(URL, { transports: ["websocket"] })
  socket.on("connect", () => {
    console.log("on connect")
    let count = 0;
    const intervalTimeout=setInterval(() => {
      socket.emit("msg", `client${i}-${Date.now()}`)
      count += 1;
      if(!(count < MESSAGE_QTY)){
        console.log("clearInterval");
        clearInterval(intervalTimeout);
        doneCount += 1;
        console.log(`doneCount: ${doneCount}`);
      }
    }, INTERVAL)
  })
}
