import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  id: string;
  userId: string;
  imageUrl: string;
  caption: string;
  likes: string[]; // array of user IDs who liked
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    imageUrl: { type: String, required: true },
    caption: { type: String, default: '' },
    likes: { type: [String], default: [] },
  },
  { timestamps: true }
);

PostSchema.index({ createdAt: -1 });
PostSchema.index({ userId: 1, createdAt: -1 });

export const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
