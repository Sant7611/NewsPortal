import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/Authmiddleware.js';
import { createNews, deleteNewsCreatedByJournalist, fetchAllNews, fetchAllNewsByCategory, fetchAllNewsCreatedByJournalist, fetchAllNewsPublicly, fetchSingleNewsByID, mostPopularArticle, relatableNews, updateNewsCategory, updateNewsCreatedByJournalist, updateNewsStatus } from '../controllers/newsController.js';
import { uploadFile } from '../middlewares/uploadFile.js';

const newsRoute = Router();


// Public routes
newsRoute.get("/single/:newsID", fetchSingleNewsByID);
newsRoute.get("/single/:newsID/:categoryID", relatableNews);
newsRoute.get("/category/:categoryID", fetchAllNewsByCategory);
newsRoute.get("/allnews", fetchAllNewsPublicly);
newsRoute.get("/popularnews", mostPopularArticle);


// Journalist protected routes (authentication needed)
newsRoute.post("/create", AuthMiddleware(['journalist', "admin"]), uploadFile("news").single('news'), createNews);

newsRoute.put('/update-status/:id', AuthMiddleware(['journalist', "admin"]), updateNewsStatus);
newsRoute.put('/update/:id', AuthMiddleware(['journalist', "admin"]), updateNewsCategory);


newsRoute.get("/all", AuthMiddleware(['journalist',"admin"]), fetchAllNews);
newsRoute.get("/my-news", AuthMiddleware(['journalist']), fetchAllNewsCreatedByJournalist);
newsRoute.patch("/update/:newsID", AuthMiddleware(['journalist']), updateNewsCreatedByJournalist);
newsRoute.delete("/delete/:newsID", AuthMiddleware(['journalist','admin']), deleteNewsCreatedByJournalist);


export default newsRoute;