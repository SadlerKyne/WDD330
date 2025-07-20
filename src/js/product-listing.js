import { loadHeaderFooter, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";


loadHeaderFooter();

//parameter to get the category from the URL
const category = getParam("category");

//instance of ProductData fetch
const dataSource = new ProductData();

//get the HTML element 
const listElement = document.querySelector(".product-list");

//instance of the ProductList class
const productList = new ProductList(category, dataSource, listElement);

//product list to fetch and render 
productList.init();