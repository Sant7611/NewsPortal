import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

const JWT_PRIVATE_KEY = process.env.PRIVATE_KEY;
const JWT_EXPIRES_IN = process.env.EXPIRES_IN;

export const generateToken = (payload) => {

    return jwt.sign(payload, JWT_PRIVATE_KEY, { expiresIn: JWT_EXPIRES_IN })
}

export const verifyToken = (token) => {

    return jwt.verify(token, JWT_PRIVATE_KEY)
}