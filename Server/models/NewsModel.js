import { model, Schema } from "mongoose";

const NewsSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: [5, "Title is too short"]
    },
    description: {
        type: String,
        required: true,
        minlength: [15, "News should be described in detail"]
    },
    journalist: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    image: [{
        fileName: {
            type: String,
            required: true
        },
        path: {
            type: String,
            required: true
        }
    }],
    category: {
        type: Schema.Types.ObjectId,
        required: [true, 'Category ID is required'],
        ref: "category"
    },
    viewCount: {
        type: Number,
        default: 0
        },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add indexes for better performance
NewsSchema.index({ status: 1 });
NewsSchema.index({ category: 1 });
NewsSchema.index({ journalist: 1 });
NewsSchema.index({ createdAt: -1 });

export const News = model("News", NewsSchema);


