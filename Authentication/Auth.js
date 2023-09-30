import jwt from "jsonwebtoken"
export async function isAuthenticated(req,res,next){
    const token=req.headers.authorization;
    if(!token){
        return res.status(400).json({data:"Invalid Authorization"})
    }
    jwt.verify(token,process.env.SECRETKEY)
    next();
}