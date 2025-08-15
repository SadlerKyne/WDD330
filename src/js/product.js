import { getParam, loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";

loadHeaderFooter();

const productId = getParam("product");

const category = getParam("category");
const dataSource = new ExternalServices();

const productDetails = new ProductDetails(productId, dataSource);
productDetails.init(category);
