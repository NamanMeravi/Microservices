import { type NextFunction, type Request, type Response } from "express"
import jwt, { type JwtPayload } from 'jsonwebtoken'

interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
}


export interface AuthenticatedRequest extends Request {
    user?: IUser | null;
}

export const isAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authheader = req.headers.authorization;

        if (!authheader || !authheader.startsWith("Bearer ")) {
            res.status(401).json({
                message: "Please Login - no auth header"
            })
            return;
        }

        const token = authheader.split(" ")[1];

        if (!token) {
            res.status(401).json({ message: "Please login - No token" });
            return;
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        if (!decode || !decode.user) {
            res.status(401).json({
                message: "Invalid Token"
            })
            return;
        }

        req.user = decode.user;

        next()
    } catch (error) {
        res.status(401).json({
            message: "IsAuth error"
        })
    }
}