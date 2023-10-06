import * as dotenv from 'dotenv';
dotenv.config();
import jwt from "jsonwebtoken"
export async function isAuthenticated(req,res,next){
    const token=req.headers.Authorization;
    if(!token){
        return res.status(400).json({data:"Invalid Authorization"})
    }
   else{
    jwt.verify(token,`${process.env.SECRETKEY}`)
    next();
   }
}