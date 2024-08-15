import mongoose from "mongoose";

const messageModel = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      trim: true,
    },
    media: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media",
      },
    ],
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    sentOn: {
      type: Date,
    },
    readOn: {
      type: Date,
    },
    deliveredOn: {
      type: Date,
    },
    deleted: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageModel);
