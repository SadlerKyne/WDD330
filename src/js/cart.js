import { getLocalStorage, loadHeaderFooter } from "./utils.mjs"; // Import loadHeaderFooter

loadHeaderFooter(); // Call this function to dynamically load the header and footer, and update the cart count on page load.

// Changed function name for consistency with previous guidance
function getCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const productListElement = document.querySelector(".product-list");
  const cartFooterElement = document.querySelector(".cart-footer");

  if (cartItems && cartItems.length > 0) {
    // If there are items, render them
    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    productListElement.innerHTML = htmlItems.join("");

    // Show the footer and calculate the total
    cartFooterElement.classList.remove("hide");
    const total = cartItems.reduce((acc, item) => acc + item.FinalPrice, 0);
    const cartTotalElement = document.querySelector(".cart-footer__total");
    cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
  } else {
    // If the cart is empty, show a message and hide the footer
    productListElement.innerHTML = "<p>Your cart is empty.</p>";
    cartFooterElement.classList.add("hide");
  }
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
