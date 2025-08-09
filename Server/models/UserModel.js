import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: [3, "UserName should be more than 3 charcter"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [3, "Please type valid Email"]
    },

    password: {
        type: String,
        required: true,
        unique: true,
        minlength: [3, "Password cannoot be empty"]
    },

    role: {
        type: String,
        required: true,
        enum: ["viewer", "journalist", "admin"],
        default: "viewer"
    }
}, { timestamps: true })

export const UserModel = mongoose.model("User", UserSchema);