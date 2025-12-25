import http from "http";
import app from "./app.js";
import { Server } from "socket.io";
import dotenv from "dotenv";
import initializeSockets from "./sockets/index.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://endpoint-notes.vercel.app",
      "https://www.endpoint-notes.vercel.app",
    ],
     credentials: true,
      methods: ["GET", "POST"],
  },
});

initializeSockets(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
