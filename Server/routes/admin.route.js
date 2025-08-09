import { Router } from "express";
import { GetAllAdmins, GetAllJournalists, GetAllUsers, GetAllViewers } from "../controllers/adminController.js";
import { AuthMiddleware } from "../middlewares/Authmiddleware.js";

const adroute = Router();

adroute.get('/viewers', AuthMiddleware(["admin"]), GetAllViewers);

adroute.get('/journalists', AuthMiddleware(["admin"]), GetAllJournalists);

adroute.get('/admins', AuthMiddleware(["admin"]), GetAllAdmins);

adroute.get('/Users', AuthMiddleware(["admin"]), GetAllUsers)

export default adroute;