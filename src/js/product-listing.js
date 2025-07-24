import { loadHeaderFooter, getParam } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs"; // Renamed import
import ProductList from "./ProductList.mjs";

// load the header and footer
loadHeaderFooter();

// get the category from the URL
const category = getParam("category");

// create an instance of ProductData
const dataSource = new ExternalServices(); 

// get the element to render the list in
const listElement = document.querySelector(".product-list");

// create an instance of our ProductList class
const myList = new ProductList(category, dataSource, listElement);

// call the init method to display the products
myList.init();