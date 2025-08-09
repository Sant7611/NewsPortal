import { Router } from "express";
import { createCategory, deleteCategory, fetchCategory, updateCategory } from "../controllers/categoryController.js";
import { AuthMiddleware } from "../middlewares/Authmiddleware.js";

const categoryRoute = Router();


// Create category - only for authenticated admins
categoryRoute.post("/create", AuthMiddleware(['admin']), createCategory);

// Fetch all categories - open to public
categoryRoute.get("/all", fetchCategory);

// Update category - only admin who created can update
categoryRoute.put("/update/:categoryID", AuthMiddleware(['admin']), updateCategory);

// Delete category - only admin who created can delete
categoryRoute.delete("/delete/:categoryID", AuthMiddleware(['admin']), deleteCategory);

export default categoryRoute;