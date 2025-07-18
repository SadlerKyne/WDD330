import { getLocalStorage, loadHeaderFooter } from "./utils.mjs"; // Import loadHeaderFooter

loadHeaderFooter(); // Call this function to dynamically load the header and footer, and update the cart count on page load.

// Changed function name for consistency with previous guidance
function getCartContents() {
  const cartItems = getLocalStorage("so-cart");

  // Check if there are items in the cart to display the footer and calculate total
  if (cartItems && cartItems.length > 0) {
    const cartFooter = document.querySelector(".cart-footer");
    // Ensure the cart footer is visible if there are items
    cartFooter.classList.remove("hide");

    // Calculate the total price of all items in the cart
    const total = cartItems.reduce((acc, item) => acc + item.FinalPrice, 0);

    // Select the correct element for displaying the total
    // Corrected selector from '.cart-total' to '.cart-footer__total'
    const cartTotalElement = document.querySelector(".cart-footer__total");
    // Update the text content with the calculated total, formatted to two decimal places
    cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
  } else {
    // If cart is empty, display a message and hide the footer
    document.querySelector(".product-list").innerHTML =
      "<p>Your cart is empty.</p>";
    document.querySelector(".cart-footer").classList.add("hide");
  }

  // Generate HTML for each item in the cart using the template
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  // Insert the generated HTML into the product list
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

// Template function to generate HTML markup for a single cart item
function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="../product_pages/index.html?product=${item.Id}" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="../product_pages/index.html?product=${item.Id}">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

// Initial call to render cart contents when the page loads
getCartContents();
