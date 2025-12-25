import {
  createNoteService,
  getMyNotesService,
  getNoteByIdService,
  updateNoteService,
  deleteNoteService,
  getActivityByNoteService,
} from "../services/note.service.js";

// =================== Create Note Controller =================
export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;
    const note = await createNoteService({ title, content, userId });
    res.status(201).json({
      success: true,
      data: note,
      message: "Note created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// =================== Get All Notes Controller =================
export const getAllNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const notes = await getMyNotesService(userId);
    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes,
      message:
        notes.length === 0 ? "No notes found" : "Notes fetched successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// =================== Get Note by ID Controller =================
export const getNoteById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const note = await getNoteByIdService({ userId: userId, noteId: id });
    res.status(200).json({
      success: true,
      data: note,
      message: note ? "Note fetched successfully" : "Note not found",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// =================== Update Note Controller =================
export const updateNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, content } = req.body;
    const note = await updateNoteService({
      noteId: id,
      title,
      content,
      userId: userId,
    });
    res.status(200).json({
      success: true,
      data: note,
      message: "Note updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// =================== Delete Note Controller =================
export const deleteNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const result = await deleteNoteService({ noteId: id, userId: userId });
    res.status(200).json({
      success: true,
      data: result,
      message: "Note deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// =================== Get Activity by Note Controller =================
export const getActivityByNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { noteId } = req.params;

    const activity = await getActivityByNoteService({
      noteId,
      userId,
    });

    res.status(200).json({
      success: true,
      count: activity.length,
      data: activity,
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      error: error.message,
    });
  }
};