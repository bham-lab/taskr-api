
import app from "./index.js";
import { createServer } from "http"
import { Server } from "socket.io"
import { socketAuth } from "./middleware/socketAuth.js";


const httpServer = createServer(app)

const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true
    }
})

export { io }
io.use(socketAuth)

io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`)


    console.log("👤 Socket user:", socket.user.id)

    const room = `user:${socket.user.id}`

    socket.join(room)

   
})

io.on("disconnect", (socket) => {
    console.log(`Client disconnected : ${socket.id}`)
})

const port = process.env.PORT || 3000



httpServer.listen(port, () => console.log(`Server running on ${port}`))
