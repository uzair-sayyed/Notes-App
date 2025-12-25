import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  createShareLink,
  accessSharedNote,
} from "../controllers/linkshare.controller.js";

const router = express.Router();

// owner creates share link
router.post("/", authMiddleware, createShareLink);

// Public access
router.get("/:token", accessSharedNote);

export default router;