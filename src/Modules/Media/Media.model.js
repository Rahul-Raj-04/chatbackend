import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    localPath: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Media = mongoose.model('Media', mediaSchema);
