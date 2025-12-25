    import express from "express";
    import {
    createNote,
    getAllNotes,
    getNoteById,
    updateNote,
    deleteNote,
    getActivityByNote,
    } from "../controllers/note.controller.js";
    import authMiddleware from "../middlewares/auth.middleware.js";
    import { getCollaborators } from "../controllers/collaborator.controller.js";

    const router = express.Router();

    router.post("/", authMiddleware, createNote);
    router.get("/", authMiddleware, getAllNotes);
    router.get("/:id", authMiddleware, getNoteById);
    router.put("/:id", authMiddleware, updateNote);
    router.delete("/:id", authMiddleware, deleteNote);
    router.get("/:noteId/collaborators", authMiddleware, getCollaborators);
    router.get("/:noteId/activity", authMiddleware, getActivityByNote);

    export default router;