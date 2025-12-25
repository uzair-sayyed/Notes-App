import {
  createShareLinkService,
  getNoteByShareLinkService,
} from "../services/linkshare.service.js";
import { logActivity } from "../services/activity.service.js";
// ================== Create Share Link =================
export const createShareLink = async (req, res) => {
  try {
    const userId = req.user.id;
    const { noteId } = req.body;

    const link = await createShareLinkService({
      noteId,
      userId,
    });

    res.status(201).json({
      success: true,
      data: {
        url: `${process.env.FRONTEND_URL}/share/${link.token}`,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// ================== Access Shared Note =================
export const accessSharedNote = async (req, res) => {
  try {
    const { token } = req.params;

    const note = await getNoteByShareLinkService({ token });

    await logActivity({
      action: "SHARE_LINK_ACCESSED",
      userId: null, // anonymous
      noteId: note.id,
    });

    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
};