import mongoose from 'mongoose';

export const PostSchema = new mongoose.Schema({
    caption: { type: String, required: true },
    creator: { type: String, required: true },
    image: { type: String, required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    numComments: { type: Number, index: true }
}, { timestamps: true });