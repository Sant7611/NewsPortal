import { StatusCodes } from 'http-status-codes';
import { News } from '../models/NewsModel.js';
import { UserRecentRead } from '../models/UserRecentRead.js';

// ========== 1️⃣ Helper to encode feature ==========
// This function maps the category and journalist to their respective index in the feature list.
const encodeFeature = (value, list) => list.indexOf(value);

// ========== 2️⃣ Fetch dynamic distinct values ==========
// Fetch distinct category values from News collection
const getDistinctCategories = async () => {
    const categoryIds = await News.distinct('category');
    return categoryIds.map(id => id.toString()); // convert ObjectId to string
};

// Fetch distinct journalist values from News collection
const getDistinctJournalists = async () => {
    const journalistIds = await News.distinct('journalist');
    return journalistIds.map(id => id.toString());
};

// ========== 3️⃣ Vector representation ==========
// Generate feature vector for news based on category and journalist
const getVector = (news, categoryValues, journalistValues) => {
    return [
        encodeFeature(news.category, categoryValues),
        encodeFeature(news.journalist, journalistValues)
    ];
};

// ========== 4️⃣ Cosine Similarity ==========
// Cosine similarity calculation between two vectors
const cosineSimilarity = (vecA, vecB) => {
    const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
    return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
};

// ========== 5️⃣ Store user's recent read ==========
// Store user's recent read for personalized recommendations
export const storeRecentRead = async (req, res) => {
    try {
        const userID = req.user._id;
        const { newsId } = req.body;

        const news = await News.findById(newsId)
            .populate('category', 'categoryName')
            .populate('journalist', 'name');

        if (!news) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "News not found"
            });
        }

        // Store new recent read with the news ID and category/journalist IDs
        await UserRecentRead.create({
            userId: userID,
            newsId,
            category: news.category._id,    // store ID, not name
            journalist: news.journalist._id
        });

        // Keep only latest 5 reads
        const count = await UserRecentRead.countDocuments({ userId: userID });
        if (count > 5) {
            const oldest = await UserRecentRead.find({ userId: userID })
                .sort({ viewAt: 1 })
                .limit(count - 5);
            await UserRecentRead.deleteMany({ _id: { $in: oldest.map(r => r._id) } });
        }

        res.status(StatusCodes.OK).json({ success: true, message: "Recent read stored" });

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};

// ========== 6️⃣ Recommend news ==========
// Get recommended news for a user based on recent reads, category and journalist data, and view count
export const getRecommendedNews = async (req, res) => {
    try {
        const userID = req.user._id;

        // Get user's recent reads (most recent first)
        const recentReads = await UserRecentRead.find({ userId: userID })
            .sort({ viewAt: -1 })
            .limit(5);

        if (!recentReads.length) {
            return res.status(StatusCodes.OK).json({ success: true, data: [] });
        }

        // Fetch dynamic values for category and journalist
        const categoryValues = await getDistinctCategories();
        const journalistValues = await getDistinctJournalists();

        // Get all approved news
        const allNews = await News.find({ status: 'approved' })
            .populate('category', 'categoryName')
            .populate('journalist', 'name');

        // Find the maximum viewCount among all approved news to normalize
        const maxViewCount = Math.max(...allNews.map(news => news.viewCount));

        // Prepare vectors for recent reads
        const recentVectors = recentReads.map(read => ({
            id: read.newsId.toString(),
            vector: getVector({
                category: read.category.toString(),
                journalist: read.journalist.toString()
            }, categoryValues, journalistValues)
        }));

        // Score all news articles based on similarity and viewCount
        const scoredNews = allNews.map(news => {
            const newsVector = getVector({
                category: news.category._id.toString(),
                journalist: news.journalist._id.toString()
            }, categoryValues, journalistValues);

            // Calculate average cosine similarity score across all recent reads
            const avgScore = recentVectors.reduce((sum, recent) => {
                return sum + cosineSimilarity(recent.vector, newsVector);
            }, 0) / recentVectors.length;

            // Normalize the viewCount between 0 and 1
            const normalizedViewCount = news.viewCount / maxViewCount;

            // Combine similarity score and viewCount (popularity) using a weighted average
            const alpha = 0.7; // 70% similarity, 30% popularity
            const finalScore = alpha * avgScore + (1 - alpha) * normalizedViewCount;

            return {
                news,
                score: finalScore,
                isRecent: recentReads.some(r => r.newsId.equals(news._id))
            };
        });

        // Filter out recently viewed news and sort by final score (descending)
        const recommendations = scoredNews
            .filter(item => !item.isRecent)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)  // Get top 5 recommended news
            .map(item => item.news);

        res.status(StatusCodes.OK).json({
            success: true,
            data: recommendations
        });

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};
