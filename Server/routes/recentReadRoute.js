import express from 'express';
import {
    getRecommendedNews,
    storeRecentRead
} from '../controllers/recentReadController.js';
import { AuthMiddleware } from '../middlewares/Authmiddleware.js';

const router = express.Router();

// Store recent read
router.post('/recent-reads', AuthMiddleware(['journalist', "admin","viewer"]), storeRecentRead);

// Get recommended news
router.post('/recommendations', AuthMiddleware(['journalist', "admin", "viewer"]), getRecommendedNews);

export default router;