import * as dotenv from 'dotenv';
dotenv.config();
import express from "express"
import { decodeJwtToken, getCodOrders, getOnlinePaidOrders } from "../Controllers/PizzaControl.js";

const router=express.Router();

router.post("/getmyorders",async(req,res)=>{
    try {
        const getId =await decodeJwtToken(req.body.token);
        const getCod=await getCodOrders(getId.id);
        const getOnlinePaidOrder=await getOnlinePaidOrders(getId.id)
    if((getCod.length >0) ||( getOnlinePaidOrder.length>0)){
     res.status(200).json({data:{
        statuscode:200,
        cod:getCod,
        onlinepayment:getOnlinePaidOrder
     }})
    }else{
        res.status(404).json({data:{
            statuscode:404,
            datas:"No Orders Found",
        }})
    }
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: "Internal server error" });
    }
})

export const myOrderRouters=router;