import customError from "../util/customError.js";
import { UserModel } from "../models/UserModel.js";
import { verifyToken } from "../util/jwt.js";

export const AuthMiddleware = (role) => {

    return async (req, res, next) => {

        try {

            // get auth header
            const authHeader = req.headers.authorization

            // check the structure of token
            if (!authHeader || !authHeader.startsWith("Bearer")) {

                throw new customError("Authentication error,token not found login again", 401);

            }

            // splitting token from authorization header
            const token = authHeader.split(" ")[1];

            // decoding token
            const decode = verifyToken(token)

            // console.log(decode)
            const user = await UserModel.findById(decode._id.toString())
            if (!user) {
                throw new customError("Unauthorized access denied", 401)
            }

            // check role here
            if (role && !role.includes(user.role)) {
                throw new customError("Forbidden: You don't have permission to access this resource", 403)
            }

            // set decode token into request head
            req.user = decode;
            next()
            // console.log(decode)

        } catch (error) {
            next(error)
        }

    }
}