import { ObjectId } from "mongodb";
import { client } from "../db.js";
import Jwt from "jsonwebtoken";

export function getAllPizza(req) {
  return client
  .db("mern-pizza")
  .collection("pizza")
  .find({deleteflag:false},{projection: {deleteflag: 0}})
  .toArray();
}

export function userSigUp(userInfo) {
  return client.db("mern-pizza").collection("users").insertOne(userInfo);
}

export function getUserSignUp(userEmail) {
  return client
    .db("mern-pizza")
    .collection("users")
    .findOne({ email: userEmail });
}

export function getPizzaDataById(id) {
  return client
    .db("mern-pizza")
    .collection("pizza")
    .findOne({ _id: new ObjectId(id)},{projection: {deleteflag: 0}});
}

export function removePassReset(value) {
  return client
    .db("mern-pizza")
    .collection("password_reset")
    .deleteOne({ token: value });
}

export function changePassword(userEmail, password) {
  return client
    .db("mern-pizza")
    .collection("users")
    .updateOne({ email: userEmail }, { $set: { password: password } });
}

export function setStringDb(value) {
  return client.db("mern-pizza").collection("password_reset").insertOne(value);
}

export function getRandomString(value) {
  return client
    .db("mern-pizza")
    .collection("password_reset")
    .findOne({ random_string: value });
}

export function getTokenPassReset(token) {
  return client
    .db("mern-pizza")
    .collection("password_reset")
    .findOne({ token: token });
}

export function addToCart(addtocart) {
  return client.db("mern-pizza").collection("addtocart").insertOne(addtocart);
}

export function getCartQuantity(data) {
  return client.db("mern-pizza").collection("addtocart").find(data).toArray();
}

//find pizza input same pizza means add the quantity or add the pizza in cart

export function getSamePizzaId(data, size) {
  return client
    .db("mern-pizza")
    .collection("addtocart")
    .findOne({ pizzaid: data, selectsize: size });
}

export function updatePizzaQuantity(data, size, qty) {
  return client
    .db("mern-pizza")
    .collection("addtocart")
    .updateOne(
      { pizzaid: data, selectsize: size },
      { $set: { quantity: qty } }
    );
}

// Delete Pizza from Cartpage

export function deleteCartPizza(id) {
  return client
    .db("mern-pizza")
    .collection("addtocart")
    .deleteOne({ _id: new ObjectId(id) });
}

//Change Cart page Pizza Qty

export function findPizzaByid(id) {
  return client
    .db("mern-pizza")
    .collection("addtocart")
    .findOne({ _id: new ObjectId(id)});
}

export function updatePizzaQty(id, qty) {
  return client
    .db("mern-pizza")
    .collection("addtocart")
    .updateOne({ _id: new ObjectId(id) }, { $set: { quantity: qty } });
}

export function findpizzaforstock(id){
return client
.db("mern-pizza")
.collection("pizza")
.findOne({_id:new ObjectId(id)})
}

// Add address

export function addAddress(data) {
  return client.db("mern-pizza").collection("address").insertOne(data);
}

//Get User Address

export function getAddress(user) {
  return client
    .db("mern-pizza")
    .collection("address")
    .findOne({ userid: user });
}
//Updata User Address

export function UpdateAddress(user, data) {
  return client
    .db("mern-pizza")
    .collection("address")
    .replaceOne({ userid: user }, data);
}
// Payment page controllers

export function addcodorders(data) {
  return client.db("mern-pizza").collection("payment-cod").insertOne(data);
}

export function clearCart(id) {
  return client
    .db("mern-pizza")
    .collection("addtocart")
    .deleteMany({ userID: id });
}

export function addonlineorders(data) {
  return client.db("mern-pizza").collection("payment-online").insertOne(data);
}

export function addAddressInOrders(id) {
  return client.db("mern-pizza").collection("address").findOne({ userid: id });
}

export function updateStock(id,value){
  return client
  .db("mern-pizza")
  .collection("pizza")
  .updateMany({_id:new ObjectId(id)},{$set:{stock:value}})
}
export function findPizzaForUpdateStock(id){
  return client
  .db("mern-pizza")
  .collection("pizza")
  .findOne({_id:new ObjectId(id)})
}
//Myorders page get data

export function getCodOrders(id) {
  return client
    .db("mern-pizza")
    .collection("payment-cod")
    .find({ userid: id })
    .toArray();
}

export function getOnlinePaidOrders(id) {
  return client
    .db("mern-pizza")
    .collection("payment-online")
    .find({ userid: id })
    .toArray();
}

// Admin page controllers

export function getAdminSignIn(mail) {
  return client.db("mern-pizza").collection("admin").findOne({ email: mail });
}

export function getPaidOrders(req) {
  return client.db("mern-pizza").collection("payment-online").find().toArray();
}
export function getCashOrders(req) {
  return client.db("mern-pizza").collection("payment-cod").find().toArray();
}
export function getCodStatus(id) {
  return client
    .db("mern-pizza")
    .collection("payment-cod")
    .findOne({ _id: new ObjectId(id) });
}
export function getOnlinePaidStatus(id) {
  return client
    .db("mern-pizza")
    .collection("payment-online")
    .findOne({ _id: new ObjectId(id) });
}
export function updateCodStatus(id, code, status, paystatus) {
  return client
    .db("mern-pizza")
    .collection("payment-cod")
    .updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          orderstep: code,
          orderstatus: status,
          paymentstatus: paystatus,
        },
      }
    );
}
export function updateOnlinePaidStatus(id, code, status) {
  return client
    .db("mern-pizza")
    .collection("payment-online")
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { orderstep: code, orderstatus: status } }
    );
}
export function deletePizza(id) {
  return client
    .db("mern-pizza")
    .collection("pizza")
    .updateOne({_id: new ObjectId(id)},{$set:{deleteflag:true}});
}

export function editpizzadata(catgory,editeddata){
return client
.db("mern-pizza")
.collection("pizza")
.updateOne({category:catgory},{$set:editeddata})
}

export function addNewPizzaData(value){
  return client 
  .db("mern-pizza")
  .collection("pizza")
  .insertOne(value)
}
//Generate JWT token
export function generateJwtToken(id) {
  return Jwt.sign({ id }, process.env.SECRETKEY);
}

export function decodeJwtToken(token) {
  return Jwt.decode(token);
}

// get pizzabyid in cart collection

export function findPizzaByidInCart(id) {
  return client
    .db("mern-pizza")
    .collection("addtocart")
    .findOne({ pizzaid: id});
}
