

import { loadHeaderFooter } from "./utils.mjs"; // Import loadHeaderFooter
import Alert from "../js/Alert.js";

loadHeaderFooter(); // Call this function to dynamically load the header and footer, and update the cart count on page load.
new Alert("../json/Alert.json");
//moved the product-listing code outside of main.js to product-listing.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("newsletter-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thank you for subscribing to our newsletter!");
      form.reset();
    });
  }
});


