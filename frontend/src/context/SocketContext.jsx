import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../hooks/useAuth";

export const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const token = user.token;

      const socketInstance = io(SOCKET_URL, {
        auth: { token },
        transports: ["websocket"],
      });

      socketInstance.on("connect", () => {
        console.log("Socket connected:", socketInstance.id);
      });

      socketInstance.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      socketInstance.on("note:error", (error) => {
        console.error("Socket error:", error);
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
