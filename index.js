import * as dotenv from 'dotenv';
dotenv.config();
import express from "express"
import { pizzaRouters } from "./Routers/PizzaRoutes.js";
import cors from 'cors'
import { userRouter } from "./Routers/UserRoutes.js";
import { isAuthenticated } from "./Authentication/Auth.js";
import { cartRouters } from "./Routers/CartRoutes.js";
import { addressRouter } from "./Routers/AddressRoutes.js";
import { paymentRouter } from "./Routers/PaymentRoutes.js";
import {  myOrderRouters } from "./Routers/MyorderRoutes.js";
import { adminRouter } from "./Routers/AdminRoutes.js";

const PORT=process.env.PORT
const app=express();
app.use(express.json())
app.use(cors({ origin: '*' }))

app.get('/', (req, res) => res.send("Server is Running Successfully!"))

app.use("/cart",isAuthenticated,cartRouters)
app.use("/payment",isAuthenticated,paymentRouter)
app.use("/address",isAuthenticated,addressRouter)
app.use("/pizza",isAuthenticated,pizzaRouters)
app.use("/user",userRouter)
app.use("/myorders",isAuthenticated,myOrderRouters)
app.use("/admin",adminRouter)
app.listen(PORT,()=>console.log("Server is running successfully",PORT))