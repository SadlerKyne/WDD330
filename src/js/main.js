import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter } from "./utils.mjs"; // Import loadHeaderFooter

loadHeaderFooter(); // Call this function to dynamically load the header and footer, and update the cart count on page load.

const dataSource = new ProductData("tents");
const listElement = document.querySelector(".product-list");

const productList = new ProductList("tents", dataSource, listElement);
productList.init();
