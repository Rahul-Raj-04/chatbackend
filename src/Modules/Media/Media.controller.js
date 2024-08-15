import { Media } from './Media.model.js';
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from '../../utils/asyncHandler.js';
import path from 'path';
import fs from 'fs';


const downloadMedia = asyncHandler(async (req, res) => {
  const mediaId = req.params.mediaId || req.body.mediaId || req.query.mediaId;

  // Validate the user is part of the chat
  // const chat = await Chat.findById(chatId).populate('users', '_id');
  // if (!chat) {
  //   throw new ApiError(500, "Chat not found");
  // }

  // if (!chat.users.some((user) => user._id.equals(req.user._id))) {
  //   throw new ApiError(403, "You are not part of this chat");
  // }

  // Find the media file
  const media = await Media.findById(mediaId);
  if (!media) {
    throw new ApiError(404, "Media file not found");
  }

  // Serve the file
  const filePath = media.localPath;
  if (fs.existsSync(filePath)) {
    res.download(filePath, media.originalName);
  } else {
    throw new ApiError(404, "File not found ask user to share again");
  }
});


export {downloadMedia} ;
