import { getAllPizza } from "../Controllers/PizzaControl.js";

export const checkStock = async () => {
  let stock = [];
  const getallpizza = await getAllPizza();
  getallpizza.map((val) => {
    if (val.stock < 20) {
      stock.push(val.name);
    }
  });
  return stock;
};
