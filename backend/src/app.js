import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import notesRoutes from "./routes/note.routes.js";
import collaboratorRoutes from "./routes/collaborator.routes.js";
import linkshareRoutes from "./routes/linkshare.routes.js";

const app = express();

app.use(
  cors({
    // origin: "*",
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://endpoint-notes.vercel.app",
      "https://www.endpoint-notes.vercel.app",
      "https://enpointe-notes.vercel.app",
      "https://www.enpointe-notes.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
        exposedHeaders: ["Set-Cookie"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Backend working");
});

// ========== Routes ==========
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/collaborators", collaboratorRoutes);
app.use("/api/share", linkshareRoutes);

export default app;
