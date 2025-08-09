import mongoose from "mongoose";

const userRecentReadSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    newsId: {
        type: mongoose.Schema.ObjectId,
        ref: 'News',
        required: true
    },
    category: {
        type: String,
        required: true
    },
    journalist: {
        type: String,
        required: true
    },
    viewAt: {
        type: Date,
        default: Date.now,
        index: { expires: '1h' }
    }
});

userRecentReadSchema.index({ userId: 1, viewAt: -1 });

export const UserRecentRead = mongoose.model("UserRecentRead", userRecentReadSchema);