import { useState } from "react";
import { noteService } from "../../services/noteService";

const ShareLinkModal = ({ noteId, onClose }) => {
  const [shareLink, setShareLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateLink = async () => {
    setLoading(true);
    try {
      const response = await noteService.createShareLink(noteId);
      setShareLink(response.data.url);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-lg max-w-md w-full p-6'>
        <h2 className='text-xl font-bold mb-4'>Share Note</h2>

        {!shareLink ? (
          <div>
            <p className='text-sm text-gray-600 mb-4'>
              Create a public read-only link that anyone can access without
              logging in.
            </p>
            <button
              onClick={generateLink}
              disabled={loading}
              className='w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400'
            >
              {loading ? "Generating..." : "Generate Share Link"}
            </button>
          </div>
        ) : (
          <div>
            <p className='text-sm text-gray-600 mb-2'>Share this link:</p>
            <div className='flex gap-2'>
              <input
                type='text'
                readOnly
                value={shareLink}
                className='flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm'
              />
              <button
                onClick={copyToClipboard}
                className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700'
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className='w-full mt-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50'
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ShareLinkModal;
