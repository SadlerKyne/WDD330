import { getParam, loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";

loadHeaderFooter();

const productId = getParam("product");
// 'tents' is a placeholder here.
// This will be dynamic
const dataSource = new ExternalServices("tents");

// Make it global so onclick handler can access it
window.productDetails = new ProductDetails(productId, dataSource);
window.productDetails.init();
