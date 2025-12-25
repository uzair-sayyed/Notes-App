import prisma from "../config/db.js";
import crypto from "crypto";

// ================== Create Share Link =================
export const createShareLinkService = async ({ noteId, userId }) => {
  const note = await prisma.note.findUnique({
    where: { id: noteId },
  });

  if (!note) throw new Error("Note not found");

  if (note.ownerId !== userId) {
    throw new Error("Only owner can create share link");
  }

  // Check existing link
  const existing = await prisma.shareLink.findFirst({
    where: { noteId },
  });

  if (existing) return existing;

  const token = crypto.randomBytes(32).toString("hex");

  return prisma.shareLink.create({
    data: {
      noteId,
      token,
    },
  });
};

// ================== Get Note by Share Link =================
export const getNoteByShareLinkService = async ({ token }) => {
  const share = await prisma.shareLink.findUnique({
    where: { token },
    include: {
      note: true,
    },
  });

  if (!share) throw new Error("Invalid or expired link");

  return {
    id: share.note.id,
    title: share.note.title,
    content: share.note.content,
    createdAt: share.note.createdAt,
    updatedAt: share.note.updatedAt,
  };
};
