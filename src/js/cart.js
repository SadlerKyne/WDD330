import {
  setLocalStorage,
  getLocalStorage,
  loadHeaderFooter,
} from "./utils.mjs"; // Import loadHeaderFooter

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
    // Multiply the price by the quantity for each item - add error checking
    const total = cartItems.reduce((acc, item) => {
      const price = item.FinalPrice || 0;
      const quantity = item.quantity || 1;
      return acc + price * quantity;
    }, 0);
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
  // Add default values to prevent undefined errors
  const itemId = item.Id || "";
  const itemImage =
    item.Image ||
    "../images/tents/marmot-ajax-tent-3-person-3-season-in-pale-pumpkin-terracotta~p~880rr_01~320.jpg";
  const itemName = item.Name || "Product";
  const itemColor =
    (item.Colors && item.Colors[0] && item.Colors[0].ColorName) || "Unknown";
  const itemQuantity = item.quantity || 1;
  const itemPrice = item.FinalPrice || 0;

  const newItem = `<li class="cart-card divider">
    <a href="../product_pages/index.html?product=${itemId}" class="cart-card__image">
      <img src="${itemImage}" alt="${itemName}"/>
    </a>
    <a href="../product_pages/index.html?product=${itemId}">
      <h2 class="card__name">${itemName}</h2>
    </a>
    <p class="cart-card__color">${itemColor}</p>
    <div class="cart-card__quantity">
      <button class="quantity-btn minus-btn" data-id="${itemId}">-</button>
      <input type="number" class="quantity-input" data-id="${itemId}" value="${itemQuantity}" min="1">
      <button class="quantity-btn plus-btn" data-id="${itemId}">+</button>
    </div>
    <p class="cart-card__price">$${itemPrice.toFixed(2)}</p>
    <button class="remove-item" data-id="${itemId}">X</button>
  </li>`;
  return newItem;
}

function updateQuantity(itemId, newQuantity) {
  const cartItems = getLocalStorage("so-cart");
  const itemIndex = cartItems.findIndex((item) => item.Id === itemId);
  if (itemIndex > -1) {
    cartItems[itemIndex].quantity = newQuantity;
    setLocalStorage("so-cart", cartItems);
    getCartContents(); // Re-render the cart
  }
}

function removeItem(itemId) {
  let cartItems = getLocalStorage("so-cart");
  cartItems = cartItems.filter((item) => item.Id !== itemId);
  setLocalStorage("so-cart", cartItems);
  getCartContents();
  loadHeaderFooter(); // Update cart icon in header
}

// Event listener for quantity buttons and remove button
document.querySelector(".product-list").addEventListener("click", (e) => {
  if (e.target.classList.contains("plus-btn")) {
    const itemId = e.target.dataset.id;
    const cartItems = getLocalStorage("so-cart");
    const cartItem = cartItems.find((item) => item.Id === itemId);
    updateQuantity(itemId, (cartItem.quantity || 1) + 1);
  } else if (e.target.classList.contains("minus-btn")) {
    const itemId = e.target.dataset.id;
    const cartItems = getLocalStorage("so-cart");
    const cartItem = cartItems.find((item) => item.Id === itemId);
    const currentQuantity = cartItem.quantity || 1;
    if (currentQuantity > 1) {
      updateQuantity(itemId, currentQuantity - 1);
    } else {
      removeItem(itemId);
    }
  } else if (e.target.classList.contains("remove-item")) {
    const itemId = e.target.dataset.id;
    removeItem(itemId);
  }
});

// Event listener for changing quantity via the input field
document.querySelector(".product-list").addEventListener("change", (e) => {
  if (e.target.classList.contains("quantity-input")) {
    const itemId = e.target.dataset.id;
    let newQuantity = parseInt(e.target.value);
    if (newQuantity < 1 || isNaN(newQuantity)) {
      newQuantity = 1;
    }
    updateQuantity(itemId, newQuantity);
  }
});

// Initial call to render cart contents when the page loads
getCartContents();
