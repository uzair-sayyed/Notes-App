import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { noteService } from "../services/noteService";

const SharedNotePage = () => {
  const { token } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSharedNote();
  }, [token]);

  const fetchSharedNote = async () => {
    try {
      setLoading(true);
      const response = await noteService.getSharedNote(token);
      setNote(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-xl text-gray-600'>Loading note...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='max-w-md w-full p-6'>
          <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4'>
            {error}
          </div>
          <p className='text-sm text-gray-600'>
            This link may be invalid or the note may have been deleted.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex items-center justify-between'>
            <h1 className='text-xl font-bold text-indigo-600'>
              📝 Shared Note
            </h1>
            <span className='text-sm text-gray-500'>Read-only view</span>
          </div>
        </div>
      </div>

      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8'>
          <h2 className='text-3xl font-bold text-gray-900 mb-6'>
            {note.title}
          </h2>

          <div className='prose max-w-none text-gray-700 whitespace-pre-wrap'>
            {note.content}
          </div>

          <div className='mt-8 pt-6 border-t border-gray-200'>
            <div className='flex items-center justify-between text-sm text-gray-500'>
              <span>
                Created: {new Date(note.createdAt).toLocaleDateString()}
              </span>
              <span>
                Last updated: {new Date(note.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className='mt-6 text-center'>
          <a
            href='/login'
            className='text-indigo-600 hover:text-indigo-800 text-sm'
          >
            Create your own notes →
          </a>
        </div>
      </div>
    </div>
  );
};

export default SharedNotePage;
