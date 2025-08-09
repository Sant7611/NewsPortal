import { Category } from "../models/categoryModel.js";
import { News } from "../models/NewsModel.js";
import { UserModel } from "../models/UserModel.js";
import { asyncErrorHandler } from "../util/asyncFunction.js";
import customError from "../util/customError.js";

// ===================== Create News =====================
export const createNews = asyncErrorHandler(async (req, res, next) => {
    const journalistID = req.user._id;
    const { title, description } = req.body;
    const categoryID =  '6890a5057fd2104222b95124';

    const journalist = await UserModel.findById(journalistID);
    if (!title || !description) {
        throw new customError("All fields are required", 400);
    }
    if (!journalist) {
        throw new customError("Journalist not found", 404);
    }

    const newsImage = req.file;

    if (!newsImage) {
        throw new customError("News image is required", 400);
    }

    const category = await Category.findById(categoryID);
    if (!category) {
        throw new customError("Category not found", 404);
    }

    const newNews = new News({
        title,
        description,
        journalist: journalistID,
        category: categoryID,
        image: [{
            path: newsImage.path,
            fileName: newsImage.filename
        }]
    });

    await newNews.save();

    res.status(201).json({
        message: 'News submitted successfully, wait for approval',
        status: "success",
        success: true,
        news: newNews
    });
});

// ===================== Fetch All News (Admin) =====================
export const fetchAllNews = asyncErrorHandler(async (req, res, next) => {
    const news = await News.find()
        .populate('category', 'categoryName')
        .populate('journalist', 'name email');

    if (news.length === 0) {
        throw new customError('No news found', 404);
    }

    res.status(200).json({
        msg: 'News fetched successfully',
        status: "success",
        success: true,
        news
    });
});

// ===================== Fetch Approved News (Public) =====================
export const fetchAllNewsPublicly = asyncErrorHandler(async (req, res, next) => {
    const news = await News.find({ status: "approved" })
        .populate('category', 'categoryName')
        .populate('journalist', 'name email');

    if (news.length === 0) {
        throw new customError('No news found', 404);
    }

    res.status(200).json({
        msg: 'News fetched successfully',
        status: "success",
        success: true,
        news
    });
});

// ===================== Fetch News by Category =====================
export const fetchAllNewsByCategory = asyncErrorHandler(async (req, res, next) => {
    const { categoryID } = req.params;
    if (!categoryID) {
        throw new customError('Category ID is required', 400);
    }

    const category = await Category.findById(categoryID);
    if (!category) {
        throw new customError('Category with this ID does not exist', 400);
    }

    const news = await News.find({ category: categoryID })
        .populate('category', 'categoryName')
        .populate('journalist', 'name email');

    if (news.length === 0) {
        throw new customError('This category does not have any news', 404);
    }

    res.status(200).json({
        msg: 'News fetched successfully',
        status: "success",
        success: true,
        news
    });
});

// ===================== Fetch Single News by ID =====================
export const fetchSingleNewsByID = asyncErrorHandler(async (req, res, next) => {
    const { newsID } = req.params;

    const news = await News.findById(newsID)
        .populate('category', 'categoryName')
        .populate('journalist', 'name email');

    if (!news) {
        throw new customError('News not found', 404);
    }

    // Increment viewCount
    news.viewCount = (news.viewCount || 0) + 1;
    await news.save(); // Save the updated view count

    res.status(200).json({
        msg: 'News fetched successfully',
        status: "success",
        success: true,
        news
    });
});


// ===================== Fetch News Created by Journalist =====================
export const fetchAllNewsCreatedByJournalist = asyncErrorHandler(async (req, res, next) => {
    const journalistID = req.user._id;
    if (!journalistID) {
        throw new customError('Journalist ID is required', 400);
    }

    const journalist = await UserModel.findById(journalistID);
    if (!journalist) {
        throw new customError('Journalist with this ID does not exist', 404);
    }

    const news = await News.find({ journalist: journalistID })
        .populate('category', 'categoryName')
        .populate('journalist', 'name email');

    if (news.length === 0) {
        throw new customError('This journalist does not have any news', 404);
    }

    res.status(200).json({
        msg: 'News fetched successfully',
        status: "success",
        success: true,
        news
    });
});

// ===================== Update News by Journalist =====================
export const updateNewsCreatedByJournalist = asyncErrorHandler(async (req, res, next) => {
    const journalistID = req.user._id;
    const { newsID } = req.params;
    const updatedData = req.body;

    if (!journalistID) {
        throw new customError('Journalist ID is required', 400);
    }

    const journalist = await UserModel.findById(journalistID);
    if (!journalist) {
        throw new customError('Journalist with this ID does not exist', 404);
    }

    const news = await News.findOne({ _id: newsID, journalist: journalistID });
    if (!news) {
        throw new customError('Unauthorized, you are not allowed to edit this news', 401);
    }

    const update = await News.findByIdAndUpdate(newsID, updatedData, { new: true, runValidators: true })
        .populate('category', 'categoryName')
        .populate('journalist', 'name email');

    res.status(200).json({
        msg: 'News updated successfully',
        status: "success",
        success: true,
        news: update
    });
});

// ===================== Delete News by Journalist =====================
export const deleteNewsCreatedByJournalist = asyncErrorHandler(async (req, res, next) => {
    const journalistID = req.user._id;
    const { newsID } = req.params;

    if (!journalistID) {
        throw new customError('Journalist ID is required', 400);
    }

    const journalist = await UserModel.findById(journalistID);
    if (!journalist) {
        throw new customError('Journalist with this ID does not exist', 404);
    }

    const news = await News.findOne({ _id: newsID});
    if (!news) {
        throw new customError('You are not authorized to delete this news article', 401);
    }

    const deletedNews = await News.findByIdAndDelete(newsID)
        .populate('category', 'categoryName')
        .populate('journalist', 'name email');

    res.status(200).json({
        msg: 'News deleted successfully',
        status: "success",
        success: true,
        news: deletedNews
    });
});

export const updateNewsStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status (optional but good)
    const allowedStatuses = ['approved', 'rejected'];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ success: false, msg: 'Invalid status value' });
    }

    try {
        const updated = await News.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, msg: 'News not found' });
        }

        res.json({ success: true, msg: `News status updated to ${status}`, news: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: 'Error updating status' });
    }
};


export const updateNewsCategory = async (req, res) => {
    const { id } = req.params;
    const { categoryId } = req.body;

    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            return res
                .status(404)
                .json({ success: false, msg: "Category not found" });
        }

        const newsItem = await News.findByIdAndUpdate(
            id,
            { category: categoryId },
            { new: true, runValidators: true }
        )
            .populate("category", "categoryName")
            .populate("journalist", "name");

        if (!newsItem) {
            return res
                .status(404)
                .json({ success: false, msg: "News item not found" });
        }

        return res.json({
            success: true,
            msg: "Category updated successfully",
            news: newsItem,
        });
    } catch (err) {
        console.error("Error in updateNewsCategory:", err);
        return res
            .status(500)
            .json({ success: false, msg: "Server error", error: err.message });
    }
};


export const mostPopularArticle = asyncErrorHandler(async (req, res, next) => {
    
    const popularArticle = await News.find({ status: "approved" }).skip(4).limit(5).populate('journalist', 'name email').populate('category');

    res.status(200).json({
        message: "popular article",
        popularArticle,
        status:'success'
    })
})

export const relatableNews = asyncErrorHandler(async (req, res, next) => {
    const { categoryID } = req.params;

    const category = await Category.findById(categoryID);
    if (!category) {
        return res.status(404).json({
            message: "Category not found",
            popularArticle: [],
            status: 'fail'
        });
    }

    const popularArticle = await News.find({
        status: "approved",
        category: categoryID  // 👉 filter by ObjectId directly
    }).limit(6);

    res.status(200).json({
        message: "Popular articles fetched successfully",
        popularArticle,
        status: 'success'
    });
});
