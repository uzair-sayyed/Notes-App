import { useState, useEffect } from "react";
import { noteService } from "../../services/noteService";

const CollaboratorList = ({ noteId }) => {
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollaborators();
  }, [noteId]);

  const fetchCollaborators = async () => {
    try {
      setLoading(true);
      const response = await noteService.getCollaborators(noteId);
      setCollaborators(response.data || []);
    } catch (err) {
      console.error("Error fetching collaborators:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (collaboratorId) => {
    if (!window.confirm("Remove this collaborator?")) return;

    try {
      await noteService.removeCollaborator(collaboratorId);
      setCollaborators(collaborators.filter((c) => c.id !== collaboratorId));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRoleChange = async (collaboratorId, newRole) => {
    try {
      await noteService.updateCollaboratorRole(collaboratorId, newRole);
      setCollaborators(
        collaborators.map((c) =>
          c.id === collaboratorId ? { ...c, role: newRole } : c
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div className='text-sm text-gray-500'>Loading...</div>;
  }

  if (collaborators.length === 0) {
    return <div className='text-sm text-gray-500'>No collaborators yet</div>;
  }

  return (
    <div className='space-y-3'>
      {collaborators.map((collab) => (
        <div
          key={collab.id}
          className='flex items-center justify-between p-3 bg-gray-50 rounded-md'
        >
          <div className='flex-1'>
            <div className='text-sm font-medium text-gray-900'>
              {collab.user.email}
            </div>
            <div className='text-xs text-gray-500'>{collab.role}</div>
          </div>

          <div className='flex items-center gap-2'>
            <select
              className='text-xs border border-gray-300 rounded px-2 py-1'
              value={collab.role}
              onChange={(e) => handleRoleChange(collab.id, e.target.value)}
            >
              <option value='EDITOR'>Editor</option>
              <option value='VIEWER'>Viewer</option>
            </select>

            <button
              onClick={() => handleRemove(collab.id)}
              className='text-xs text-red-600 hover:text-red-800'
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CollaboratorList;
