import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { addCollaborator, deleteCollaborator, updateCollaboratorRole } from "../controllers/collaborator.controller.js";


const router = express.Router();

router.post("/", authMiddleware, addCollaborator);
router.put("/:id", authMiddleware, updateCollaboratorRole);
router.delete("/:id", authMiddleware, deleteCollaborator);

export default router;