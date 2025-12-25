import prisma from "../config/db.js";

// ================== Add Collaborator Service =================
export const addCollaboratorService = async ({
  noteId,
  ownerId,
  collaboratorEmail,
  role,
}) => {
  const note = await prisma.note.findFirst({
    where: {
      id: noteId,
      ownerId: ownerId,
    },
  });

  if (!note) throw new Error("Only owner can add collaborators");

  const user = await prisma.user.findUnique({
    where: {
      email: collaboratorEmail,
    },
  });

  if (!user) throw new Error("Collaborator user not found");

  const existing = await prisma.noteCollaborator.findFirst({
    where: {
      noteId,
      userId: user.id,
    },
  });

  if (existing) {
    throw new Error("User already a collaborator");
  }

  if (!["EDITOR", "VIEWER"].includes(role)) {
    throw new Error("Invalid role");
  }

  if (user.id === ownerId) {
    throw new Error("Owner itself cannot be added as collaborator");
  }

  return prisma.noteCollaborator.create({
    data: {
      noteId: noteId,
      userId: user.id,
      role: role,
    },
    select: {
      id: true,
      noteId: true,
      userId: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

// =============== Update Collaborator Service =================
export const updateCollaboratorRoleService = async ({
  collaboratorId,
  ownerId,
  role,
}) => {
  const collaborator = await prisma.noteCollaborator.findUnique({
    where: { id: collaboratorId },
    include: { note: true },
  });

  if (!collaborator || collaborator.note.ownerId !== ownerId) {
    throw new Error("Not authorized");
  }

  if (!["EDITOR", "VIEWER"].includes(role)) {
    throw new Error("Invalid role");
  }

  return prisma.noteCollaborator.update({
    where: { id: collaboratorId },
    data: { role },
  });
};

// =================== Get Collaborators =================
export const getCollaboratorsService = async ({ noteId, userId }) => {
  const note = await prisma.note.findFirst({
    where: {
      id: noteId,
      OR: [
        { ownerId: userId },
        { collaborators: { some: { userId: userId } } },
      ],
    },
  });

  if (!note) throw new Error("Not authorized to view collaborators");

  return prisma.noteCollaborator.findMany({
    where: {
      noteId: noteId,
    },
    include: {
      user: {
        select: { id: true, email: true, role: true },
      },
    },
  });
};

// =================== Delete Collaborator Service =================
export const deleteCollaboratorService = async ({
  collaboratorId,
  ownerId,
}) => {
  const collaborator = await prisma.noteCollaborator.findUnique({
    where: {
      id: collaboratorId,
    },
    include: {
      note: true,
    },
  });
  if (!collaborator || collaborator.note.ownerId !== ownerId) {
    throw new Error("Not authorized to delete this collaborator");
  }
  return prisma.noteCollaborator.delete({
    where: {
      id: collaboratorId,
    },
  });
};
