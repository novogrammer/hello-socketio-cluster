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

io.on("connection", socket => {
  console.log(`client connected to ${process.env.PORT}`)
  socket.on("msg", data => {
    console.log(`msg from ${process.env.PORT}: ${data}`)
    io.emit("msg", `from ${process.env.PORT}: ${data}`)
  })
})

httpServer.listen(process.env.PORT)
console.log("listening on", process.env.PORT)
