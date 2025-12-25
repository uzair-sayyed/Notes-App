import prisma from "../config/db.js";

export const logActivity = async ({ action, userId, noteId }) => {
  return prisma.activityLog.create({
    data: {
      action,
      userId,
      noteId,
    },
  });
};
