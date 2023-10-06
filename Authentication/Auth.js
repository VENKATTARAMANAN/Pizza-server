import * as dotenv from 'dotenv';
dotenv.config();
import jwt from "jsonwebtoken"
export async function isAuthenticated(req,res,next){
    console.log(req.headers.authorization);
    const token=req.headers.authorization;
    console.log('token::: ', token);
    if(!token){
        return res.status(400).json({data:"Invalid Authorization"})
    }

    jwt.verify(token,`${process.env.SECRETKEY}`)
    next();
  
}