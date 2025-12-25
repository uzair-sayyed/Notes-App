import prisma from "../config/db.js";
import { logActivity } from "./activity.service.js";

// Helper
const getUserAccessForNote = async ({ noteId, userId }) => {
  const note = await prisma.note.findUnique({
    where: { id: noteId },
    include: {
      collaborators: true,
    },
  });

  if (!note) return null;

  // owner
  if (note.ownerId === userId) {
    return { role: "OWNER", note };
  }

  // collaborator
  const collaborator = note.collaborators.find((c) => c.userId === userId);

  if (!collaborator) return null;

  return { role: collaborator.role, note };
};

// ================== Create Note Service =================
export const createNoteService = async ({ title, content, userId }) => {
  const note = await prisma.note.create({
    data: {
      title,
      content,
      ownerId: userId,
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  await logActivity({
    action: "NOTE_CREATED",
    userId,
    noteId: note.id,
  });

  return note;
};

// ================== Get All Notes for User Service =================
export const getMyNotesService = async (userId) => {
  return prisma.note.findMany({
    where: {
      OR: [{ ownerId: userId }, { collaborators: { some: { userId } } }],
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      ownerId: true,
      collaborators: {
        select: {
          role: true,
          userId: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
};

// ================== Get Note by ID Service =================
export const getNoteByIdService = async ({ userId, noteId }) => {
  const access = await getUserAccessForNote({ noteId, userId });

  if (!access) {
    throw new Error("not authorized to view this note");
  }

  const { note } = access;

  return {
    id: note.id,
    title: note.title,
    content: note.content,
    ownerId: note.ownerId,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
    collaborators: note.collaborators.map(c => ({ 
      id: c.id,
      userId: c.userId,
      role: c.role
    }))
  };
};

// ================== Update Note Service =================
export const updateNoteService = async ({ noteId, title, content, userId }) => {
  const note = await prisma.note.findUnique({
    where: { id: noteId },
    include: {
      collaborators: true,
    },
  });

  if (!note) {
    throw new Error("Note not found");
  }

  // Owner can edit
  if (note.ownerId === userId) {
    const updated = await prisma.note.update({
      where: { id: noteId },
      data: { title, content },
    });

    await logActivity({
      action: "NOTE_UPDATED",
      userId,
      noteId,
    });

    return updated;
  }

  // Check collaborator role
  const collaborator = note.collaborators.find((c) => c.userId === userId);

  if (!collaborator) {
    throw new Error("Not authorized to edit this note");
  }

  if (collaborator.role !== "EDITOR") {
    throw new Error("You have read-only access to this note");
  }

  await logActivity({
    action: "NOTE_UPDATED",
    userId,
    noteId,
  });

  return prisma.note.update({
    where: { id: noteId },
    data: { title, content },
  });
};

// ================== Delete Note Service =================
export const deleteNoteService = async ({ noteId, userId }) => {
  const note = await prisma.note.findUnique({
    where: { id: noteId },
  });

  if (!note) {
    throw new Error("Note not found");
  }

  if (note.ownerId !== userId) {
    throw new Error("Not authorized to delete this note");
  }
  await logActivity({
    action: "NOTE_DELETED",
    userId,
    noteId,
  });

  return prisma.note.delete({
    where: { id: noteId },
  });
};

// ================== Get Activity By Note Service =================
export const getActivityByNoteService = async ({ noteId, userId }) => {
  const access = await getUserAccessForNote({ noteId, userId });
  if (!access) throw new Error("Not authorized");

  return prisma.activityLog.findMany({
    where: { noteId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, email: true },
      },
    },
  });
};
