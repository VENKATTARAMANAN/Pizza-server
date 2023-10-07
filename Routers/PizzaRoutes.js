import * as dotenv from 'dotenv';
dotenv.config();
import express from "express";
import {
  addAddressInOrders,
  addToCart,
  addonlineorders,
  clearCart,
  decodeJwtToken,
  findPizzaForUpdateStock,
  getAllPizza,
  getCartQuantity,
  getPizzaDataById,
  updateStock,
} from "../Controllers/PizzaControl.js";
import crypto from "crypto";
import Razorpay from "razorpay";
const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const pizzas = await getAllPizza(req);
    if (!pizzas) {
      return res.status(400).json({ data: "Please add pizza" });
    }
    res.status(200).json({ data: pizzas });
  } catch (error) {
    res.status(500).json({ data: "Internal Server Error" });
  }
});

router.get("/:databyid", async (req, res) => {
  try {
    const val = await getPizzaDataById(req.params.databyid);
    if (!val) {
      return res.status(400).json({ data: "data not found" });
    }
    res.status(200).json({ data: val });
  } catch (error) {
    res.status(500).json({ data: "Internal Server Error" });
  }
});

router.post("/orders", async (req, res) => {
  const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});
  try {
    const options = {
      amount: req.body.amount*100,
      currency: "INR",
      // receipt: crypto.randomBytes(10).toString("hex"),
    };
    const order = await instance.orders.create(options);
    res.status(200).json({ data: order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Internal Server error" });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =  
    req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
    .createHmac("sha256", process.env.KEY_SECRET)
    .update(sign.toString())
    .digest("hex");
    if ( razorpay_signature === expectedSign) 
    {
      const getId =await decodeJwtToken(req.body.token);
        const val = { userID: getId.id };
    const value = await getCartQuantity(val);
    const addaddress=await addAddressInOrders(getId.id)
    const  conforder={
      items:value,
      paymentmode:"Online",
      userid:getId.id,
      total:req.body.price,
      paymentid:razorpay_payment_id,
      address:addaddress,
      paymentstatus:"Paid",
      orderstep:1,
      orderstatus:"pending"
    }
    const confirmOrder=addonlineorders(conforder);
    const clrCart=clearCart(getId.id);
    let findPizza,values,updatePizzaStock;
if(confirmOrder){
    value.map(async(val)=>(
        findPizza=await findPizzaForUpdateStock(val.pizzaid),
        values=findPizza.stock - val.quantity,
        updatePizzaStock=await updateStock(val.pizzaid,values)
    ))
}
      return res.status(200).json({ data: {
        status_code:"200",
        paymentid:razorpay_payment_id,
        datas:"Payment successfully"
      } });
    } else {
      return res.status(400).json({ data: "Payment failed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Internal server error" });
  }
});

export const pizzaRouters = router;
