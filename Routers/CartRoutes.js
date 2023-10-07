import * as dotenv from 'dotenv';
dotenv.config();
import express from "express";
import {
  addToCart,
  decodeJwtToken,
  deleteCartPizza,
  findPizzaByid,
  findPizzaByidInCart,
  findpizzaforstock,
  getCartQuantity,
  getSamePizzaId,
  updatePizzaQty,
  updatePizzaQuantity,
} from "../Controllers/PizzaControl.js";

const router = express.Router();

router.put("/addtocart", async (req, res) => {
  try {
    const getpizzadata = await findpizzaforstock(req.body.pizzaid);
    const getpizzacart = await findPizzaByidInCart(req.body.pizzaid);
    if (getpizzacart) {
      if (getpizzacart.quantity + 1 <= getpizzadata.stock) {
        addToCartFunc(req, res);
      } else {
        res.status(400).json({
          data: `Available stock only ${getpizzadata.stock}`,
        });
      }
    } else {
      if (getpizzadata.stock >= req.body.quantity) {
        addToCartFunc(req, res);
      } else {
        res.status(400).json({
          data: `Available stock only ${getpizzadata.stock}`,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Internal server error" });
  }
});

router.post("/showcartquantity", async (req, res) => {
  try {
    const getId =await decodeJwtToken(req.body.token);
    const val = { userID: getId.id };
    const value = await getCartQuantity(val);
    if (!value) {
      res.status(400).json({ data: "No product found" });
    } else {
      res.status(200).json({ data: value });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Internal server error" });
  }
});

// Delete Cartpage Pizza

router.post("/deletecartpizza", async (req, res) => {
  try {
    const deletePizza = await deleteCartPizza(req.body._id);
    if (deletePizza) {
      res.status(200).json({ data: "Pizza Deleted successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Internal server error" });
  }
});

//Update Qty in cart page

router.put("/subqty", async (req, res) => {
  try {
    const findPizza = await findPizzaByid(req.body._id);
    if (findPizza.quantity === 1) {
      const deletePizza = await deleteCartPizza(findPizza._id);
      res.status(200).json({ data: "Pizza Deleted successfully" });
    } else {
      const sub = (await findPizza.quantity) - 1;
      const data = await updatePizzaQty(findPizza._id, sub);
      res.status(200).json({ data: "qty reduced by 1" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Internal server error" });
  }
});

router.put("/addqty", async (req, res) => {
  try {
    const findPizza = await findPizzaByid(req.body._id);
    const getpizzadata = await findpizzaforstock(findPizza.pizzaid);
    if (getpizzadata.stock > findPizza.quantity) {
      if (findPizza) {
        const add = (await findPizza.quantity) + 1;
        const data = await updatePizzaQty(findPizza._id, add);
        res.status(200).json({ data: "qty added by 1" });
      } else {
        res.status(400).json({ data: "failed to add quantity" });
      }
    } else {
      res
        .status(400)
        .json({ data: `Available stock only ${getpizzadata.stock}` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Internal server error" });
  }
});

export const cartRouters = router;

const addToCartFunc = async (req, res) => {
  const getId =await decodeJwtToken(req.body.auth);
  const getsamepizza = await getSamePizzaId(
    req.body.pizzaid,
    req.body.selectsize,
    getId.id
  );
  if (!getsamepizza) {
    const addUserId = { ...req.body, userID: getId.id };
    const cartData = await addToCart(addUserId);
  } else if (req.body.selectsize === "regular") {
    const addquantity =await updatePizzaQuantity(
      getsamepizza.pizzaid,
      getsamepizza.selectsize,
      getsamepizza.quantity + 1
    );
  } else if (req.body.selectsize === "medium") {
    const addquantity =await updatePizzaQuantity(
      getsamepizza.pizzaid,
      getsamepizza.selectsize,
      getsamepizza.quantity + 1
    );
  } else if (req.body.selectsize == "large") {
    const addquantity =await updatePizzaQuantity(
      getsamepizza.pizzaid,
      getsamepizza.selectsize,
      getsamepizza.quantity + 1
    );
  }
  res.status(200).json({ data: "Product added to cart successfully" });
};
