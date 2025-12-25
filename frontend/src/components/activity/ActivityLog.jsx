import { useState, useEffect } from "react";
import { noteService } from "../../services/noteService";

const ActivityLog = ({ noteId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
  }, [noteId]);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const response = await noteService.getActivityLog(noteId);
      setActivities(response.data || []);
    } catch (err) {
      console.error("Error fetching activity:", err);
    } finally {
      setLoading(false);
    }
  };

  const getActionLabel = (action) => {
    const labels = {
      NOTE_CREATED: "Created note",
      NOTE_UPDATED: "Updated note",
      NOTE_DELETED: "Deleted note",
      COLLABORATOR_ADDED: "Added collaborator",
      COLLABORATOR_REMOVED: "Removed collaborator",
      SHARE_LINK_CREATED: "Created share link",
      SHARE_LINK_ACCESSED: "Accessed via share link",
    };
    return labels[action] || action;
  };

  if (loading) {
    return <div className='text-sm text-gray-500'>Loading activity...</div>;
  }

  if (activities.length === 0) {
    return <div className='text-sm text-gray-500'>No activity yet</div>;
  }

  return (
    <div className='space-y-3 max-h-96 overflow-y-auto'>
      {activities.map((activity) => (
        <div
          key={activity.id}
          className='flex items-start gap-3 p-3 bg-gray-50 rounded-md'
        >
          <div className='flex-shrink-0 w-2 h-2 mt-2 bg-indigo-600 rounded-full'></div>
          <div className='flex-1 min-w-0'>
            <div className='text-sm text-gray-900'>
              {getActionLabel(activity.action)}
            </div>
            <div className='text-xs text-gray-500 mt-1'>
              {activity.user?.email || "Anonymous"} •{" "}
              {new Date(activity.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityLog;
