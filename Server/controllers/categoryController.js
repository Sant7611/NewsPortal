import { Category } from "../models/categoryModel.js";
import { UserModel } from "../models/UserModel.js";
import { asyncErrorHandler } from "../util/asyncFunction.js";
import customError from "../util/customError.js";

export const createCategory = asyncErrorHandler(async (req, res, next) => {

    const categoryName = req.body.category;

    const adminId = req.user._id;

    if (!categoryName) {
        throw new customError("category field name is required", 400)
    }
    if (!adminId) {
        throw new customError("adminId is required", 400)
    }

    const user = await UserModel.findById(adminId);
    if (!user) {
        throw new customError("user not found", 400)
    }

    const category = await Category.create({ categoryName, adminId: user._id });

    res.status(201).json({
        msg: "category created successfully",
        category,
        success: true,
        status: 'success'
    })

})

export const fetchCategory = asyncErrorHandler(async (req, res, next) => {

    const category = await Category.find();
    if (category.length === 0) {
        throw new customError("no category found", 404)
    }

    res.status(200).json({
        msg: "category fetched successfully",
        data: category,
        success: true,
        status: 'success'
    })

})

export const updateCategory = asyncErrorHandler(async (req, res, next) => {

    const { categoryID } = req.params;
    const categoryName = req.body.category;


    const adminId = req.user._id;

    // console.log(adminId)

    if (!categoryName) {
        throw new customError('Name is required', 400);
    }
    if (!adminId) {
        throw new customError('User id is required', 400);
    }

    const user = await UserModel.findById(adminId);

    if (!user) {
        throw new customError('User not found', 404);//404 for not found
    }

    const category = await Category.findById(categoryID);

    if (!category) {
        throw new customError('category not found', 404);//401 Invalid credentials
    }

    // console.log(category.adminId)

    if (category.adminId.toString() !== adminId.toString()) {
        throw new customError('Only admin can perform this operation', 403)//forbidden error
    }

    //updating category nameHere
    category.categoryName = categoryName;
    const updatedCategory = await category.save();
    // const updateCategory = await Category.findByIdAndUpdate(categoryId, { name }, { new: true });

    res.status(200).json({
        msg: "category updated successfully",
        data: updatedCategory,
        success: true,
        status: 'success'
    })

})

export const deleteCategory = asyncErrorHandler(async (req, res, next) => {

    const { categoryID } = req.params;

    const adminId = req.user._id;

    // console.log(adminId)

    if (!categoryID) {
        throw new customError('categoryID is required', 400);
    }
    if (!adminId) {
        throw new customError('User id is required', 400);
    }

    const user = await UserModel.findById(adminId);

    if (!user) {
        throw new customError('User not found', 404);//404 for not found
    }

    const category = await Category.findById(categoryID);

    if (!category) {
        throw new customError('category not found', 404);//401 Invalid credentials
    }

    // console.log(category.adminId)

    if (category.adminId.toString() !== adminId.toString()) {
        throw new customError('Only admin can perform this operation', 403)//forbidden error
    }

    const deletedCategory = await Category.deleteOne({ _id: categoryID });

    res.status(200).json({
        msg: "category deleted successfully",
        data: deletedCategory,
        success: true,
        status: 'success'
    })

})
