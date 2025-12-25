import prisma from "../config/db.js";

export const registerSocket = (io, socket) => {

  // ===== JOIN NOTE ROOM =====
  socket.on("note:join", async ({ noteId }) => {
    try {
      const userId = socket.user.id;

      const note = await prisma.note.findUnique({
        where: { id: noteId },
        include: { collaborators: true },
      });

      if (!note) return socket.emit("note:error", "Note not found");

      if (
        note.ownerId === userId ||
        note.collaborators.some((c) => c.userId === userId)
      ) {
        socket.join(`note:${noteId}`);
        return socket.emit("note:joined", { noteId });
      }

      socket.emit("note:error", "Not authorized");
    } catch (err) {
      socket.emit("note:error", err.message);
    }
  });

  // ===== UPDATE NOTE =====
  socket.on("note:update", async ({ noteId, title, content }) => {
    try {
      const userId = socket.user.id;

      const note = await prisma.note.findUnique({
        where: { id: noteId },
        include: { collaborators: true },
      });

      if (!note) return socket.emit("note:error", "Note not found");

      let canEdit = false;

      if (note.ownerId === userId) {
        canEdit = true;
      } else {
        const collaborator = note.collaborators.find(
          (c) => c.userId === userId
        );
        if (collaborator?.role === "EDITOR") {
          canEdit = true;
        }
      }

      if (!canEdit) {
        return socket.emit("note:error", "Read-only access");
      }

      // 🔥 UPDATE DB
      const updatedNote = await prisma.note.update({
        where: { id: noteId },
        data: { title, content },
      });

      // 🔥 BROADCAST
      io.to(`note:${noteId}`).emit("note:updated", {
        noteId,
        title: updatedNote.title,
        content: updatedNote.content,
        updatedAt: updatedNote.updatedAt,
        updatedBy: socket.user.email,
      });

    } catch (err) {
      console.error("Socket update error:", err);
      socket.emit("note:error", "Update failed");
    }
  });
};
