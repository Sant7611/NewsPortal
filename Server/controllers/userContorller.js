import { UserModel } from "../models/UserModel.js"
import { asyncErrorHandler } from "../util/asyncFunction.js";
import { comparePassword, hashPassword } from "../util/bcrypt.js";
import customError from "../util/customError.js";
import { generateToken } from "../util/jwt.js";


export const registration = asyncErrorHandler(async (req, res, next) => {

    const { password, ...data } = req.body;
    const newUser = new UserModel(data)

    const user = await UserModel.findOne({ email: data.email })
    if (user) {
        throw new customError("user already exits", 400)
    }

    const hashedPassword = await hashPassword(password);

    newUser.password = hashedPassword;

    newUser.save();


    res.status(201).json({
        message: "User created successfully ",
        newUser
    })
})

export const login = asyncErrorHandler(async (req, res, next) => {

    const { password, ...data } = req.body;

    const user = await UserModel.findOne({ email: data.email })
    if (!user) {
        throw new customError("Invalid email password", 403)
    }

    const isMatch = await comparePassword(password, user.password)
    if (!isMatch) {
        throw new customError("Invalid email password", 400)
    }

    const payload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    const token = generateToken(payload)


    // send ok status
    res.status(200).json({
        message: "login successfull",
        success: true,
        user: payload,
        access_token: token
    })
})


export const getProfile = asyncErrorHandler(async (req, res, next) => {

    const userID = req.user._id;
    // console.log(userID)

    const profile = await UserModel.findById(userID).select('-password');
    if (!profile) {
        throw new customError("Profile not found", 404)
    }

    res.status(200).json({
        msg: "Profile fetched",
        status: "success",
        data: profile,
        success: true,

    })
})

export const updateProfile = asyncErrorHandler(async (req, res, next) => {

    const userID = req.user._id;

    const { username } = req.body;

    const user = await UserModel.findById(userID)
    if (!user) {
        throw new customError("Profile not found", 404)
    }

    const updatedUsername = await UserModel.findByIdAndUpdate(userID, { username: username }, { new: true })

    res.status(200).json({
        msg: "Profile updated",
        status: "success",
        data: updatedUsername,
        success: true,

    })
})

export const getUserByID = asyncErrorHandler(async (req, res, next) => {

    const { userID } = req.params;

    const user = await UserModel.findById(userID).select('-password');
    if (!user) {
        throw new customError("User not found", 404)
    }

    res.status(200).json({
        msg: "Profile fetched",
        status: "success",
        data: user,
        success: true,

    })
})


export const deleteUserByID = asyncErrorHandler(async (req, res, next) => {

    const { userID } = req.params;

    const deletedUser = await UserModel.findByIdAndDelete(userID)
    if (!deletedUser) {
        throw new customError("User not found", 404)
    }

    res.status(200).json({
        msg: "Profile deleted successfully",
        status: "success",
        data: null,
        success: true,

    })
})
