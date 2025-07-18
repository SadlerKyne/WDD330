import { getParam, loadHeaderFooter } from "./utils.mjs"; // Import loadHeaderFooter
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

loadHeaderFooter(); // Call this function to dynamically load the header and footer, and update the cart count on page load.

const productId = getParam("product");
const dataSource = new ProductData("tents"); // The 'tents' category here will be refined later to be dynamic

const product = new ProductDetails(productId, dataSource);
product.init();
