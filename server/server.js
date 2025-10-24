import os from "os"
import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import { createAdapter } from "@socket.io/redis-adapter"
import { createClient } from "redis"

const app = express()
app.use(express.static("public"))  // ← public配下をホスティング

const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: "*" } })

const pubClient = createClient({ url: process.env.REDIS_URL })
const subClient = pubClient.duplicate()
const dataClient = pubClient.duplicate()
await pubClient.connect()
await subClient.connect()
await dataClient.connect()
io.adapter(createAdapter(pubClient, subClient))

const instanceId = os.hostname()

let previousTotalCount = -1;
let localCount = 0;

io.on("connection", socket => {
  console.log(`client connected to ${instanceId}`)
  socket.on("msg", data => {
    console.log(`msg from ${instanceId}: ${data}`)
    io.emit("msg", `from ${instanceId}: ${data}`)
  })
  socket.on("vote", () =>{
    localCount++;
  })
  // 接続時にtotalを送っておく
  socket.emit("total",previousTotalCount);

  socket.on("disconnect", reason => {
    console.log(`client disconnected from ${instanceId}: ${reason}`)
  })
})

setInterval(()=>{
  const localCountCopy = localCount;
  localCount = 0;
  dataClient.incrBy("vote:total",localCountCopy).then((totalCount)=>{
    if(previousTotalCount != totalCount){
      io.emit("total",totalCount);
      previousTotalCount = totalCount;
    }
  })
},100);


httpServer.listen(process.env.PORT)
console.log("listening on", process.env.PORT)
