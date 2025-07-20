
import { loadHeaderFooter } from "./utils.mjs"; // Import loadHeaderFooter
import Alert from "/js/Alert.js";

loadHeaderFooter(); // Call this function to dynamically load the header and footer, and update the cart count on page load.
new Alert("../json/Alert.json");
//moved the product-listing code outside of main.js to product-listing.js


