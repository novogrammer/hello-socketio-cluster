import io from "socket.io-client"

const URL = "http://localhost:8080/"
const CLIENTS = 100
const INTERVAL = 100  // ms

const LOOP_QTY = 100;
const Q = 100;

console.log("start")
let doneCount = 0;
for (let i = 0; i < CLIENTS; i++) {
  console.log("start each")
  const socket = io(URL, { transports: ["websocket"] })
  socket.on("connect", () => {
    console.log("on connect")
    let count = 0;
    const intervalTimeout=setInterval(() => {
      for(let j = 0; j < Q; j++){
        socket.emit("vote")
      }
      count += 1;
      if(!(count < LOOP_QTY)){
        console.log("clearInterval");
        clearInterval(intervalTimeout);
        doneCount += 1;
        console.log(`doneCount: ${doneCount}`);
        socket.disconnect();
      }
    }, INTERVAL)
  })
}
