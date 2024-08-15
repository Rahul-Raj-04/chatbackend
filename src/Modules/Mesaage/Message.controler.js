
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Message } from "./Message.model.js";
import { mongoose } from "mongoose";
import { User } from "../CTHUser/User.model.js";
import { Chat } from "../Chats/Chat.model.js";
import { Media } from "../Media/Media.model.js";
import { uploadOnCloudinary } from "../../utils/Cloudinary.js";
import { upload } from "../../middlewares/FileUpload.middlwares.js"; // Adjust the import path as necessary
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  const files = req.files;
  let mediaIds = [];

  if (!content && (!files.images || !files.documents) && !chatId) {
    console.log("Bad Request! Invalid Data passed!");
    return res.sendStatus(400);
  }
  if (files && files.images) {
    for (const file of files.images) {
      const uploadedImage = await uploadOnCloudinary(file.path);

      if (!uploadedImage) {
        throw new ApiError(400, "Failed to upload image");
      }
      const media = new Media({
        chat: chatId,
        sender: req.user._id,
        fileType: "image",
        localPath: file.path,
        filePath: uploadedImage.url,
        originalName: file.originalname,
      });
      await media.save();
      mediaIds.push(media._id);
    }
  }

  if (files&&files.documents) {
    for (const file of files.documents) {
      const uploadedDocument = await uploadOnCloudinary(file.path);

      if (!uploadedDocument) {
        throw new ApiError(400, "Failed to upload document");
      }
      const media = new Media({
        chat: chatId,
        sender: req.user._id,
        fileType: "document",
        localPath:file.path,
        filePath: uploadedDocument.url,
        originalName: file.originalname,
      });
      await media.save();
      mediaIds.push(media._id);
    }
  }

  const newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
    media: mediaIds,
    sentOn:Date.now()
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name avatar");

    message = await message.populate("chat");

    message = await User.populate(message, {
      path: "chat.users",
      select: "name avatar email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name avatar email")
      .populate("chat")
      .populate("media");
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error(error.message);
  }
});
const deliveredOn = asyncHandler(async (req, res) => {
  const messageIds = req.body.messageIds;
  try {
    const Data={
      deliveredOn:Date.now()
    };
    const updatedMessages = await Promise.all(
      messageIds.map(async (messageId) => {
        return await Message.findByIdAndUpdate(messageId, Data, {
          new: true,
          runValidators: false,
        });
      })
    );
  res.status(200).json(updatedMessages);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error(error.message);
  }
});
const readOn = asyncHandler(async (req, res) => {
  const messageIds = req.body.messageIds; // Expecting an array of message IDs
  try {
    const Data = {
      readOn: Date.now()
    };

    // Update each message in parallel using Promise.all
    const updatedMessages = await Promise.all(
      messageIds.map(async (messageId) => {
        return await Message.findByIdAndUpdate(messageId, Data, {
          new: true,
          runValidators: false,
        });
      })
    );

    res.status(200).json(updatedMessages);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error(error.message);
  }
});


export { sendMessage, allMessages, upload,readOn,deliveredOn };
