import { useAuth } from "../../hooks/useAuth";

const NoteCard = ({ note, onDelete, onClick }) => {
  const { user } = useAuth();
  console.log("NoteCard user:", user);
  console.log("NoteCard note:", note);
  const isOwner = note.ownerId === user?.user?.id;
  const userCollaborator = note.collaborators?.find(
    (c) => c.userId === user?.user?.id
  );

  const getRoleBadge = () => {
    if (isOwner) {
      return {
        label: "Owner",
        className: "bg-purple-100 text-purple-800 border-purple-200",
      };
    } else if (userCollaborator?.role === "EDITOR") {
      return {
        label: "Editor",
        className: "bg-green-100 text-green-800 border-green-200",
      };
    } else if (userCollaborator?.role === "VIEWER") {
      return {
        label: "Viewer",
        className: "bg-gray-100 text-gray-800 border-gray-200",
      };
    }
    return null;
  };

  const roleBadge = getRoleBadge();

  return (
    <div
      className='bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer relative group'
      onClick={onClick}
    >
      <div className='p-6'>
        {roleBadge && (
          <div className='absolute top-4 right-4'>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full border ${roleBadge.className}`}
            >
              {roleBadge.label}
            </span>
          </div>
        )}

        <h3 className='text-lg font-semibold text-gray-900 mb-2 pr-16 truncate'>
          {note.title}
        </h3>

        <p className='text-gray-600 text-sm line-clamp-3 mb-4'>
          {note.content}
        </p>

        <div className='flex items-center justify-between text-xs text-gray-500'>
          <span>{new Date(note.updatedAt).toLocaleDateString()}</span>

          {isOwner && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              className='text-red-600 hover:text-red-800 font-medium opacity-0 group-hover:opacity-100 transition-opacity'
            >
              Delete
            </button>
          )}
        </div>

        {note.collaborators && note.collaborators.length > 0 && (
          <div className='mt-3 pt-3 border-t border-gray-100'>
            <div className='flex items-center text-xs text-gray-500'>
              <svg
                className='w-4 h-4 mr-1'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path d='M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z' />
              </svg>
              {note.collaborators.length} collaborator
              {note.collaborators.length !== 1 ? "s" : ""}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteCard;
