import socketAuth from "./auth.socket.js";
import { registerSocket } from "./note.socket.js";

const initializeSockets = (io) => {
    io.use(socketAuth);

    io.on("connection", (socket)=> {
        console.log("socket connected:", socket.user?.email)
        registerSocket(io, socket);

        socket.on("disconnect", () => {
            console.log("socket disconnected:", socket.user?.email)
        });
    })
}

export default initializeSockets;