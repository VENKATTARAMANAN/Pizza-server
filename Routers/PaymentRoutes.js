import express from "express";
import {
  addAddressInOrders,
  addcodorders,
  clearCart,
  decodeJwtToken,
  findPizzaForUpdateStock,
  getAllPizza,
  getCartQuantity,
  updateStock,
} from "../Controllers/PizzaControl.js";
import { checkStock } from "../Common/checkStock.js";
import { sendMail } from "../Common/mail.js";
import * as dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

router.post("/cod", async (req, res) => {
  try {
    const getId = await decodeJwtToken(req.body.token);
    const val = { userID: getId.id };
    const value = await getCartQuantity(val);
    const addaddress = await addAddressInOrders(getId.id);
    const codorder = {
      paymentmode: "COD",
      paymentstatus: "No paid",
      total: req.body.total,
      items: value,
      userid: getId.id,
      address: addaddress,
      orderstep: 1,
      orderstatus: "pending",
    };
    const codord = await addcodorders(codorder);
    const clrCart = await clearCart(getId.id);
    let findPizza, values, updatePizzaStock;
    if (codord) {
      value.map(
        async (val) => (
          (findPizza = await findPizzaForUpdateStock(val.pizzaid)),
          (values = findPizza.stock - val.quantity),
          (updatePizzaStock = await updateStock(val.pizzaid, values))
        )
      );
      res.status(200).json({ data: "Order Placed Successfully" });
    }

    // Checking stock
    const stock =await checkStock();

    // Send mail for low Stock
    if(stock.length > 0){
       await sendMail(`${process.env.MAIL_ID}`, "Update the Pizza stock",  `Listed Pizzas Stocks are Below 20, Please Update the stock :- \n ${stock}`)
    }
    //---------------End----------------------------//
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Internal server error" });
  }
});

router.post("/onlinepayment", async (req, res) => {
  try {
    const getId = await decodeJwtToken(req.body.token);
    const val = { userID: getId.id };
    const value = await getCartQuantity(val);
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Internal server error" });
  }
});
export const paymentRouter = router;
