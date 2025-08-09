import { model, Schema } from "mongoose";

const categorySchema = new Schema({

    categoryName: {
        type: String,
        required: true,
        minlength: [0, 'category cannot be empty']
    },
    adminId: {
        type: Schema.Types.ObjectId,
        required: [true, 'adminID is required']
    }
}, { timestamps: true })

export const Category = model('category', categorySchema)