import { Router } from "express";
import { deleteUserByID, getProfile, login, registration, updateProfile } from "../controllers/userContorller.js";
import { validator } from "../middlewares/validatorMiddleware.js";
import { LoginSchemaValidator, SignupSchemaValidator } from "../validator/AuthorizationValidator.js";
import { AuthMiddleware } from "../middlewares/Authmiddleware.js";

const userRoute = Router();

userRoute.post("/register", validator(SignupSchemaValidator), registration);

userRoute.post("/signin", validator(LoginSchemaValidator), login);

//secured authenticated route
userRoute.get("/profile",  AuthMiddleware(["viewer", "journalist", "admin"]), getProfile);
userRoute.patch("/updateProfile",  AuthMiddleware(["viewer", "journalist", "admin"]), updateProfile);
userRoute.delete("/delete", AuthMiddleware(["viewer", "journalist", "admin"]), deleteUserByID);
export default userRoute;