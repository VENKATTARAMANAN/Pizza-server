import * as dotenv from 'dotenv';
dotenv.config();
import express from "express";
import {
  addNewPizzaData,
  deletePizza,
  editpizzadata,
  generateJwtToken,
  getAdminSignIn,
  getCashOrders,
  getCodOrders,
  getCodStatus,
  getOnlinePaidStatus,
  getPaidOrders,
  getPizzaDataById,
  updateCodStatus,
  updateOnlinePaidStatus,
  updateStock,
} from "../Controllers/PizzaControl.js";
import bcrypt from "bcrypt";
import { isAuthenticated } from "../Authentication/Auth.js";


const router = express.Router();

router.post("/adminlogin", async (req, res) => {
  try {
    const getAdminMail = await getAdminSignIn(req.body.email);

    if (!getAdminMail) {
      return res.status(400).json({ data: "Invalid email" });
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      getAdminMail.password
    );
    if (!validPassword) {
      return res.status(400).json({ data: "Invalid Password" });
    } else {
      const token = await generateJwtToken(getAdminMail._id);
      res.status(200).json({
        data: {
          message: "Successfully logged in",
          token: token,
          statuscode: 200,
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Internal server error" });
  }
});

router.get("/getorders",isAuthenticated, async (req, res) => {
  try {
    const getcod = await getCashOrders(req);
    const getonline = await getPaidOrders(req);
    if (getcod.length > 0 || getonline.length > 0) {
      res.status(200).json({
        data: {
          cod: getcod,
          online: getonline,
          statuscode: 200,
        },
      });
    } else {
      res.status(404).json({ data: "No orders found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Internal server error" });
  }
});

router.post("/updataorderstatus",isAuthenticated, async (req, res) => {
  try {
    const { orderType } = req.body;
    switch (orderType) {
      case "cod":
        const getCod = await getCodStatus(req.body.id);
        if (getCod) {
          const data = (await getCod.orderstep) + 1;
          let updateCod;
          if (data === 4) {
            updateCod = await updateCodStatus(
              req.body.id,
              data,
              "completed",
              "Paid"
            );
          } else {
            updateCod = await updateCodStatus(
              req.body.id,
              data,
              "pending",
              "No paid"
            );
          }
          if (updateCod) {
            res.status(200).json({ data: "Status Updated Successfully" });
          } else {
            res.status(400).json({ data: "Status not Updated" });
          }
        } else {
          res.status(400).json({ data: "No order Found" });
        }
        break;
      case "paid":
        const getOnlinePaid = await getOnlinePaidStatus(req.body.id);
        if (getOnlinePaid) {
          const data = (await getOnlinePaid.orderstep) + 1;
          let updatePaid;
          if (data === 4) {
            updatePaid = await updateOnlinePaidStatus(
              req.body.id,
              data,
              "completed"
            );
          } else {
            updatePaid = await updateOnlinePaidStatus(
              req.body.id,
              data,
              "pending"
            );
          }
          if (updatePaid) {
            res.status(200).json({ data: "Status Updated Successfully" });
          } else {
            res.status(400).json({ data: "Status not Updated" });
          }
        } else {
          res.status(400).json({ data: "No order Found" });
        }
        break;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Internal server error" });
  }
});

router.delete("/deletepizza/:id",isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const delPizza = await deletePizza(id);
    if (delPizza) {
      res.status(200).json({
        data: {
          statuscode: 200,
          sta: "Pizza Deleted Succesfully",
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Internal server error" });
  }
});

router.get("/editpizza/:id",isAuthenticated, async (req, res) => {
  try {
    const val = await getPizzaDataById(req.params.id);
    if (val) {
      res.status(200).json({
        data: {
          statuscode: 200,
          dat: val,
        },
      });
    } else {
      res.status(400).json({ data: "No data found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Internal server error" });
  }
});

router.put("/updatestock",isAuthenticated, async (req, res) => {
  try {
    const val = await getPizzaDataById(req.body._id);
    if (val) {
      const addqty = val.stock + 1;
      const value = await updateStock(req.body._id, addqty);
      if (value) {
        res.status(200).json({ data: "Qty Updated successfully" });
      } else {
        res.status(400).json({ data: "Qty update Failed" });
      }
    } else {
      res.status(400).json({ data: "data not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Internal server error" });
  }
});

router.put("/editpizzadata",isAuthenticated, async (req, res) => {
  try {
    const editedpizzadata = await editpizzadata(req.body.category, req.body);
    if (editedpizzadata) {
      res.status(200).json({ data: "Pizza updated successfully" });
    } else {
      res.status(400).json({ data: "Pizza updated failed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Internal server error" });
  }
});

router.post("/addnewpizza",isAuthenticated,async(req,res)=>{
try {
  const addpizza=await addNewPizzaData(req.body);
  if(addpizza){
    res.status(200).json({data:"New pizza added successfully"});
  }else{
    res.status.apply(400).json({data:"Failed to add new pizza"})
  }
} catch (error) {
  console.log(error);
    res.status(500).json({ data: "Internal server error" });
}
})

export const adminRouter = router;
