import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { noteService } from "../services/noteService";
import Navbar from "../components/shared/Navbar";
import NoteCard from "../components/notes/NoteCard";

const DashboardPage = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [creating, setCreating] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = notes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(notes);
    }
  }, [searchQuery, notes]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await noteService.getAllNotes();
      setNotes(response.data || []);
      setFilteredNotes(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      const response = await noteService.createNote(
        newNoteTitle,
        newNoteContent
      );
      setShowCreateModal(false);
      setNewNoteTitle("");
      setNewNoteContent("");
      navigate(`/notes/${response.data.id}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await noteService.deleteNote(noteId);
      setNotes(notes.filter((note) => note.id !== noteId));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>My Notes</h1>
          <p className='mt-2 text-gray-600'>
            Create and collaborate on notes in real-time
          </p>
        </div>

        <div className='mb-6 flex gap-4'>
          <input
            type='text'
            placeholder='Search notes...'
            className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={() => setShowCreateModal(true)}
            className='px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500'
          >
            + New Note
          </button>
        </div>

        {loading ? (
          <div className='text-center py-12'>
            <div className='text-gray-600'>Loading notes...</div>
          </div>
        ) : error ? (
          <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded'>
            {error}
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-gray-600'>
              {searchQuery
                ? "No notes found matching your search."
                : "No notes yet. Create your first note!"}
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={handleDeleteNote}
                onClick={() => navigate(`/notes/${note.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-lg max-w-md w-full p-6'>
            <h2 className='text-xl font-bold mb-4'>Create New Note</h2>
            <form onSubmit={handleCreateNote}>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Title
                  </label>
                  <input
                    type='text'
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    placeholder='Enter note title'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Content
                  </label>
                  <textarea
                    required
                    rows='4'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder='Start writing...'
                  />
                </div>
              </div>
              <div className='mt-6 flex gap-3'>
                <button
                  type='button'
                  onClick={() => setShowCreateModal(false)}
                  className='flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={creating}
                  className='flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400'
                >
                  {creating ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
