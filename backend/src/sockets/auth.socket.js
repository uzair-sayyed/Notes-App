import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/jwt.js";

const socketAuth = (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication token missing"));
    }

    const decoded = verifyToken(token);
    socket.user = decoded;
    next();
  } catch (error) {
    next(new Error("Invalid or expired token"));
  }
};

export default socketAuth;
