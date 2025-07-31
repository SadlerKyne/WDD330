import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs"; // Import the new CheckoutProcess class

loadHeaderFooter(); // Call this function to dynamically load the header and footer, and update the cart count on page load.

const myCheckout = new CheckoutProcess(".checkout-form"); // CheckoutProcess
myCheckout.init();
document.querySelector("#checkout-form").addEventListener("submit", (e) => {
  // Listen for form submission
  e.preventDefault(); // Prevent default form submission

  const form = e.target;
  if (form.checkValidity()) {
    myCheckout.checkout(form); // Call the checkout method with the form element
  } else {
    form.reportValidity();
  }
});
