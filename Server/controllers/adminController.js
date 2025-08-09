import { UserModel } from "../models/UserModel.js";
import { asyncErrorHandler } from "../util/asyncFunction.js";

export const GetAllViewers = asyncErrorHandler(async (req, res, next) => {

    const users = await UserModel.find({ role: "viewer" }).select('-password');
    if (users.length > 0) {
        res.status(200).json({ message: "Users registered", users });
    } else {
        res.status(404).json({ message: "No viewer available" });
    }
});

export const GetAllJournalists = asyncErrorHandler(async (req, res, next) => {
    const users = await UserModel.find({ role: "journalist" }).select('-password');
    if (users.length > 0) {
        res.status(200).json({ message: "Users registered", users });
    } else {
        res.status(404).json({ message: "No journalist available" });
    }
});

export const GetAllAdmins = asyncErrorHandler(async (req, res, next) => {
    const users = await UserModel.find({ role: "admin" }).select('-password');
    if (users.length > 0) {
        res.status(200).json({ message: "Users registered", users });
    } else {
        res.status(404).json({ message: "No admin available" });
    }
});

export const GetAllUsers = asyncErrorHandler(async (req, res, next) => {
    const users = await UserModel.find().select('-password');
    res.status(200).json({
        message: "Users fetched successfully",
        users,
        success:"true"
    });
});
