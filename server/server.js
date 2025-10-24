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
await pubClient.connect()
await subClient.connect()
io.adapter(createAdapter(pubClient, subClient))

const instanceId = os.hostname()

io.on("connection", socket => {
  console.log(`client connected to ${instanceId}`)
  socket.on("msg", data => {
    console.log(`msg from ${instanceId}: ${data}`)
    io.emit("msg", `from ${instanceId}: ${data}`)
  })

  socket.on("disconnect", reason => {
    console.log(`client disconnected from ${instanceId}: ${reason}`)
  })
})

httpServer.listen(process.env.PORT)
console.log("listening on", process.env.PORT)
