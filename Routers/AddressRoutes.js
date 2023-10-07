import * as dotenv from 'dotenv';
dotenv.config();
import  express  from "express";
import { UpdateAddress, addAddress, decodeJwtToken, getAddress } from "../Controllers/PizzaControl.js";

const router=express.Router();

router.post("/addaddress",async(req,res)=>{
    try {
       
        const getId =decodeJwtToken(req.body.userid);
        req.body={...req.body,userid:getId.id}
        const addaddress=await addAddress(req.body)
        res.status(200).json({data:"address added successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: "Internal server error" });
    }
})

router.post("/getaddress",async(req,res)=>{
    try {
        const getId =decodeJwtToken(req.body.token);
        const getaddress=await getAddress(getId.id)
        res.status(200).json({
            data:getaddress
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: "Internal server error" });
    }
})

// Update address

router.post("/updateaddress",async(req,res)=>{
    try {
       
        const getId =   decodeJwtToken(req.body.userid);
        req.body={...req.body,userid:getId.id}
        const changeaddress=await UpdateAddress(getId.id,req.body)
        if(changeaddress){
            res.status(200).json({data:"Address changed successfully"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: "Internal server error" });
    }
})
export const addressRouter=router;