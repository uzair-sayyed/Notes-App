import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { noteService } from "../services/noteService";
import { useSocket } from "../hooks/useSocket";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/shared/Navbar";
import CollaboratorList from "../components/collaborators/CollaboratorList";
import AddCollaborator from "../components/collaborators/AddCollaborator";
import ActivityLog from "../components/activity/ActivityLog";
import ShareLinkModal from "../components/shared/ShareLinkModal";

const NoteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { user } = useAuth();

  const [note, setNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [lastUpdatedBy, setLastUpdatedBy] = useState("");
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [permissionError, setPermissionError] = useState("");

  const saveTimeoutRef = useRef(null);

  // Permission checks
  const isOwner = user?.user?.id === note?.ownerId;
  const userCollaborator = note?.collaborators?.find(
    (c) => c.userId === user?.user?.id
  );
  const canEdit = isOwner || userCollaborator?.role === "EDITOR";
  const isViewer = userCollaborator?.role === "VIEWER";

  // Fetch note on mount
  useEffect(() => {
    fetchNote();
  }, [id]);

  // Socket setup
  useEffect(() => {
    if (!socket || !id) return;

    socket.emit("note:join", { noteId: id });

    socket.on("note:joined", ({ noteId }) => {
      console.log("Joined note room:", noteId);
    });

    socket.on("note:updated", (data) => {
      if (data.noteId === id) {
        setTitle(data.title);
        setContent(data.content);
        setLastUpdatedBy(data.updatedBy);
        setTimeout(() => setLastUpdatedBy(""), 3000);
      }
    });

    socket.on("note:error", (error) => {
      console.error("Socket error:", error);
      setPermissionError(error);
      setTimeout(() => setPermissionError(""), 3000);
    });

    return () => {
      socket.off("note:joined");
      socket.off("note:updated");
      socket.off("note:error");
    };
  }, [socket, id]);

  const fetchNote = async () => {
    try {
      setLoading(true);
      const response = await noteService.getNoteById(id);
      setNote(response.data);
      setTitle(response.data.title);
      setContent(response.data.content);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (newTitle, newContent) => {
    if (!canEdit) {
      setPermissionError("You don't have permission to edit this note");
      setTimeout(() => setPermissionError(""), 3000);
      return;
    }

    setTitle(newTitle);
    setContent(newContent);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveNote(newTitle, newContent);
    }, 1000);
  };

  const saveNote = async (newTitle, newContent) => {
    if (!socket) {
      try {
        setSaving(true);
        await noteService.updateNote(id, newTitle, newContent);
      } catch (err) {
        console.error("Save error:", err);
        setPermissionError(err.message);
        setTimeout(() => setPermissionError(""), 3000);
      } finally {
        setSaving(false);
      }
      return;
    }

    socket.emit("note:update", {
      noteId: id,
      title: newTitle,
      content: newContent,
    });
  };

  const handleDelete = async () => {
    if (!isOwner) {
      setPermissionError("Only the owner can delete this note");
      setTimeout(() => setPermissionError(""), 3000);
      return;
    }

    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await noteService.deleteNote(id);
      navigate("/dashboard");
    } catch (err) {
      setPermissionError(err.message);
      setTimeout(() => setPermissionError(""), 3000);
    }
  };

  const handleShareClick = () => {
    if (!isOwner) {
      setPermissionError("Only the owner can create share links");
      setTimeout(() => setPermissionError(""), 3000);
      return;
    }
    setShowShareModal(true);
  };

  const handleAddCollaboratorClick = () => {
    if (!isOwner) {
      setPermissionError("Only the owner can add collaborators");
      setTimeout(() => setPermissionError(""), 3000);
      return;
    }
    setShowCollaborators(!showCollaborators);
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <Navbar />
        <div className='flex items-center justify-center py-12'>
          <div className='text-xl text-gray-600'>Loading note...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <Navbar />
        <div className='max-w-7xl mx-auto px-4 py-8'>
          <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded'>
            {error}
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className='mt-4 text-indigo-600 hover:text-indigo-800'
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {permissionError && (
          <div className='mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <svg
                  className='h-5 w-5 text-yellow-400'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <p className='text-sm text-yellow-700'>{permissionError}</p>
              </div>
            </div>
          </div>
        )}

        <div className='mb-6 flex items-center justify-between'>
          <button
            onClick={() => navigate("/dashboard")}
            className='text-indigo-600 hover:text-indigo-800 flex items-center gap-2'
          >
            ← Back to Dashboard
          </button>

          <div className='flex items-center gap-3'>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                isOwner
                  ? "bg-purple-100 text-purple-800"
                  : canEdit
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {isOwner ? "Owner" : canEdit ? "Editor" : "Viewer"}
            </span>

            {saving && <span className='text-sm text-gray-500'>Saving...</span>}
            {lastUpdatedBy && (
              <span className='text-sm text-green-600'>
                Updated by {lastUpdatedBy}
              </span>
            )}

            <button
              onClick={handleShareClick}
              disabled={!isOwner}
              className={`px-4 py-2 text-sm border rounded-md ${
                isOwner
                  ? "border-gray-300 hover:bg-gray-50"
                  : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              title={!isOwner ? "Only owner can create share links" : ""}
            >
              Share
            </button>

            <button
              onClick={handleAddCollaboratorClick}
              className='px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50'
            >
              Collaborators
            </button>

            <button
              onClick={() => setShowActivity(!showActivity)}
              className='px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50'
            >
              Activity
            </button>

            {isOwner && (
              <button
                onClick={handleDelete}
                className='px-4 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50'
              >
                Delete
              </button>
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            {isViewer && (
              <div className='mb-4 bg-blue-50 border border-blue-200 rounded-md p-3'>
                <div className='flex items-center'>
                  <svg
                    className='h-5 w-5 text-blue-400 mr-2'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <p className='text-sm text-blue-700'>
                    You have read-only access to this note
                  </p>
                </div>
              </div>
            )}

            <input
              type='text'
              className={`w-full text-3xl font-bold border-none focus:outline-none mb-4 ${
                !canEdit ? "bg-gray-50 cursor-not-allowed" : ""
              }`}
              placeholder='Note Title'
              value={title}
              onChange={(e) => handleChange(e.target.value, content)}
              disabled={!canEdit}
              onFocus={() => {
                if (!canEdit) {
                  setPermissionError(
                    "You don't have permission to edit this note"
                  );
                  setTimeout(() => setPermissionError(""), 3000);
                }
              }}
            />

            <textarea
              className={`w-full h-96 border-none focus:outline-none resize-none text-gray-700 ${
                !canEdit ? "bg-gray-50 cursor-not-allowed" : ""
              }`}
              placeholder={
                canEdit
                  ? "Start writing your note..."
                  : "This note is read-only"
              }
              value={content}
              onChange={(e) => handleChange(title, e.target.value)}
              disabled={!canEdit}
              onFocus={() => {
                if (!canEdit) {
                  setPermissionError(
                    "You don't have permission to edit this note"
                  );
                  setTimeout(() => setPermissionError(""), 3000);
                }
              }}
            />

            <div className='mt-4 text-xs text-gray-500'>
              Last updated: {new Date(note.updatedAt).toLocaleString()}
            </div>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {showCollaborators && (
              <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                <h3 className='text-lg font-semibold mb-4'>Collaborators</h3>
                {isOwner ? (
                  <>
                    <AddCollaborator
                      noteId={id}
                      onAdded={() => {
                        fetchNote();
                      }}
                    />
                    <div className='mt-4'>
                      <CollaboratorList noteId={id} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className='mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded'>
                      Only the owner can manage collaborators
                    </div>
                    <CollaboratorList noteId={id} />
                  </>
                )}
              </div>
            )}

            {showActivity && (
              <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                <h3 className='text-lg font-semibold mb-4'>Activity Log</h3>
                <ActivityLog noteId={id} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareLinkModal noteId={id} onClose={() => setShowShareModal(false)} />
      )}
    </div>
  );
};

export default NoteDetailPage;
