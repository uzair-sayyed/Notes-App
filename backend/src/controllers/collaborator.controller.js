import {
  addCollaboratorService,
  updateCollaboratorRoleService,
  deleteCollaboratorService,
  getCollaboratorsService,
} from "../services/collaborator.service.js";

// ================== Add Collaborator Controller =================

export const addCollaborator = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { noteId, collaboratorEmail, role } = req.body;

    const collaborator = await addCollaboratorService({
      noteId,
      ownerId,
      collaboratorEmail,
      role,
    });

    res.status(201).json({
      success: true,
      data: collaborator,
      message: "Collaborator added successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// ================== Get Collaborators Controller =================
export const getCollaborators = async (req, res) => {
  try {
    const userId = req.user.id;
    const { noteId } = req.params;

    const collaborators = await getCollaboratorsService({
      noteId,
      userId,
    });

    res.status(200).json({
      success: true,
      count: collaborators.length,
      data: collaborators,
      message:
        collaborators.length === 0 ? "No collaborators found" : "Collaborators fetched successfully",
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      error: error.message,
    });
  }
};
// =============== Update Collaborator Role Controller =================
export const updateCollaboratorRole = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const collaboratorId = req.params.id;
    const { role } = req.body;

    const collaborator = await updateCollaboratorRoleService({
      collaboratorId,
      ownerId,
      role,
    });
    res.status(200).json({
      success: true,
      data: collaborator,
      message: "Collaborator role updated",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// ================== Delete Collaborator Controller =================
export const deleteCollaborator = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const collaboratorId = req.params.id;

    await deleteCollaboratorService({ collaboratorId, ownerId });

    res.status(200).json({
      success: true,
      message: "Collaborator deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
