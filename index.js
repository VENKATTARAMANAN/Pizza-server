import express from "express"
import dotenv from "dotenv"
import { pizzaRouters } from "./Routers/PizzaRoutes.js";
import cors from 'cors'
import { userRouter } from "./Routers/UserRoutes.js";
import { isAuthenticated } from "./Authentication/Auth.js";
import { cartRouters } from "./Routers/CartRoutes.js";
import { addressRouter } from "./Routers/AddressRoutes.js";
import { paymentRouter } from "./Routers/PaymentRoutes.js";
import {  myOrderRouters } from "./Routers/MyorderRoutes.js";
import { adminRouter } from "./Routers/AdminRoutes.js";

dotenv.config();
const PORT=process.env.PORT
const app=express();
app.use(express.json())
app.use(cors({ origin: '*' }))
app.use("/cart",cartRouters)
app.use("/payment",paymentRouter)
app.use("/address",addressRouter)
app.use("/pizza",pizzaRouters)
app.use("/user",userRouter)
app.use("/myorders",myOrderRouters)
app.use("/admin",adminRouter)
app.listen(PORT,()=>console.log("Server is running successfully",PORT))