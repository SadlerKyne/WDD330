import { getParam, loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs"; // Renamed import
import ProductDetails from "./ProductDetails.mjs";

loadHeaderFooter();

const productId = getParam("product");
// 'tents' is a placeholder here.
// This will be dynamic 
const dataSource = new ExternalServices("tents");

const product = new ProductDetails(productId, dataSource);
product.init();