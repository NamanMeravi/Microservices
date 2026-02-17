import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const JWT_SCERET = process.env.JWT_SCRETE as string;

export const generateToken=async(user:any)=>{
        return jwt.sign({user},JWT_SCERET,{expiresIn:"1d"})
}