import api from './api';

export const noteService = {
  // Get all notes
  getAllNotes: async () => {
    const response = await api.get('/notes');
    return response.data;
  },

  // Get single note
  getNoteById: async (id) => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  // Create note
  createNote: async (title, content) => {
    const response = await api.post('/notes', { title, content });
    return response.data;
  },

  // Update note
  updateNote: async (id, title, content) => {
    const response = await api.put(`/notes/${id}`, { title, content });
    return response.data;
  },

  // Delete note
  deleteNote: async (id) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },

  // Search notes
  searchNotes: async (query) => {
    const response = await api.get(`/notes/search?q=${query}`);
    return response.data;
  },

  // Get collaborators
  getCollaborators: async (noteId) => {
    const response = await api.get(`/notes/${noteId}/collaborators`);
    return response.data;
  },

  // Add collaborator
  addCollaborator: async (noteId, collaboratorEmail, role) => {
    const response = await api.post('/collaborators', {
      noteId,
      collaboratorEmail,
      role,
    });
    return response.data;
  },

  // Update collaborator role
  updateCollaboratorRole: async (collaboratorId, role) => {
    const response = await api.put(`/collaborators/${collaboratorId}`, { role });
    return response.data;
  },

  // Remove collaborator
  removeCollaborator: async (collaboratorId) => {
    const response = await api.delete(`/collaborators/${collaboratorId}`);
    return response.data;
  },

  // Get activity log
  getActivityLog: async (noteId) => {
    const response = await api.get(`/notes/${noteId}/activity`);
    return response.data;
  },

  // Create share link
  createShareLink: async (noteId) => {
    const response = await api.post('/share', { noteId });
    return response.data;
  },

  // Get shared note (public)
  getSharedNote: async (token) => {
    const response = await api.get(`/share/${token}`);
    return response.data;
  },
};
