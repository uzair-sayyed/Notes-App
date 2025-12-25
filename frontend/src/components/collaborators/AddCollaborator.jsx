import { useState } from "react";
import { noteService } from "../../services/noteService";

const AddCollaborator = ({ noteId, onAdded }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("EDITOR");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await noteService.addCollaborator(noteId, email, role);
      setSuccess("Collaborator added successfully!");
      setEmail("");
      setRole("EDITOR");
      onAdded();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className='space-y-3'>
        {error && (
          <div className='text-sm text-red-600 bg-red-50 px-3 py-2 rounded'>
            {error}
          </div>
        )}
        {success && (
          <div className='text-sm text-green-600 bg-green-50 px-3 py-2 rounded'>
            {success}
          </div>
        )}

        <div>
          <input
            type='email'
            placeholder='Collaborator email'
            className='w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <select
            className='w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value='EDITOR'>Editor (can edit)</option>
            <option value='VIEWER'>Viewer (read-only)</option>
          </select>
        </div>

        <button
          type='submit'
          disabled={loading}
          className='w-full px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400'
        >
          {loading ? "Adding..." : "Add Collaborator"}
        </button>
      </form>
    </div>
  );
};

export default AddCollaborator;
