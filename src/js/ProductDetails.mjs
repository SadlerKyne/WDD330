import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource; // instance of ExternalServices
  }

  async init() {
    try {
      this.product = await this.dataSource.findProductById(this.productId);
      this.renderProductDetails();
    } catch (error) {
      // Fallback for when API fails - use basic product info
      this.product = {
        Id: this.productId,
        Brand: { Name: "Product" },
        NameWithoutBrand: "Details",
        Image:
          "../images/tents/marmot-ajax-tent-3-person-3-season-in-pale-pumpkin-terracotta~p~880rr_01~320.jpg",
        FinalPrice: 0,
        Colors: [{ ColorName: "Unknown" }],
        DescriptionHtmlSimple: "Product details loading...",
      };
      this.renderProductDetails();
    }

    // Add simple comments section
    this.addCommentsSection();

    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  // Simple comments functionality
  addCommentsSection() {
    const productSection = document.querySelector(".product-detail");

    // Add basic HTML for comments
    const commentsHTML = `
      <div class="simple-comments">
        <h3>Customer Comments</h3>

        <div class="add-comment">
          <input type="text" id="user-name" placeholder="Your name" />
          <textarea id="comment-text" placeholder="Write your comment..."></textarea>
          <button onclick="productDetails.addComment()">Add Comment</button>
        </div>

        <div id="comments-list"></div>
      </div>
    `;

    productSection.insertAdjacentHTML("beforeend", commentsHTML);

    // Load and display existing comments
    this.displayComments();
  }

  addComment() {
    const name = document.getElementById("user-name").value.trim();
    const text = document.getElementById("comment-text").value.trim();

    if (!name || !text) {
      alert("Please fill in both fields");
      return;
    }

    // Get existing comments or create empty array
    const comments = getLocalStorage(`comments-${this.productId}`) || [];

    // Add new comment
    comments.push({
      name: name,
      text: text,
      date: new Date().toLocaleDateString(),
    });

    // Save comments
    setLocalStorage(`comments-${this.productId}`, comments);

    // Clear form
    document.getElementById("user-name").value = "";
    document.getElementById("comment-text").value = "";

    // Refresh display
    this.displayComments();
  }

  displayComments() {
    const comments = getLocalStorage(`comments-${this.productId}`) || [];
    const commentsList = document.getElementById("comments-list");

    if (comments.length === 0) {
      commentsList.innerHTML = "<p>No comments yet. Be the first!</p>";
      return;
    }

    // Show all comments
    commentsList.innerHTML = comments
      .map(
        (comment) => `
        <div class="comment">
          <strong>${comment.name}</strong> - ${comment.date}
          <p>${comment.text}</p>
        </div>
      `,
      )
      .join("");
  }

  addProductToCart() {
    // Get cart from local storage, or initialize an empty array
    const cartItems = getLocalStorage("so-cart") || [];

    // Check if the product is already in the cart
    const existingProductIndex = cartItems.findIndex(
      (item) => item.Id === this.product.Id,
    );

    if (existingProductIndex > -1) {
      // If it is, just increase the quantity by 1
      cartItems[existingProductIndex].quantity += 1;
    } else {
      // If it's not, set its quantity to 1 and add it to the cart
      this.product.quantity = 1;
      cartItems.push(this.product);
    }

    // Save the updated cart back to local storage
    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  document.querySelector("h2").textContent = product.Brand.Name;
  document.querySelector("h3").textContent = product.NameWithoutBrand;

  const productImage = document.getElementById("productImage");
  productImage.src = product.Image;
  productImage.alt = product.NameWithoutBrand;

  // Calculate discount and update price display
  const originalPrice = product.SuggestedRetailPrice || product.FinalPrice;
  const finalPrice = product.FinalPrice;
  const hasDiscount = originalPrice && originalPrice > finalPrice;

  const priceElement = document.getElementById("productPrice");

  if (hasDiscount) {
    const discountAmount = originalPrice - finalPrice;
    const discountPercentage = Math.round(
      (discountAmount / originalPrice) * 100,
    );

    priceElement.innerHTML = `
      <span class="price__original">$${originalPrice.toFixed(2)}</span><br>
      <span class="price__final">$${finalPrice.toFixed(2)}</span>
      <span class="price__discount">SAVE $${discountAmount.toFixed(2)} (${discountPercentage}% OFF)</span>
    `;
  } else {
    priceElement.textContent = `$${finalPrice.toFixed(2)}`;
  }

  document.getElementById("productColor").textContent =
    product.Colors[0].ColorName;
  document.getElementById("productDesc").innerHTML =
    product.DescriptionHtmlSimple;

  document.getElementById("addToCart").dataset.id = product.Id;
}
