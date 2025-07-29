import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
    this.product = await this.dataSource.findProductById(this.productId);
    // the product details are needed before rendering the HTML
    this.renderProductDetails();

    // Add simple comments section (this will always work)
    this.addCommentsSection();

    // once the HTML is rendered, add a listener to the Add to Cart button
    // Notice the .bind(this). This callback will not work if the bind(this) is missing. Review the readings from this week on "this" to understand why.
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
  // Use API image if available, otherwise fallback to relative path
  if (product.Images && product.Images.PrimaryLarge) {
    productImage.src = product.Images.PrimaryLarge;
    // Set Image property for cart compatibility
    product.Image = product.Images.PrimaryLarge;
  } else if (product.Image) {
    productImage.src = product.Image;
  }
  productImage.alt = product.NameWithoutBrand;

  // Set Name property for cart compatibility (combines brand + product name)
  if (!product.Name) {
    product.Name = `${product.Brand.Name} ${product.NameWithoutBrand}`;
  }

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

// ************* Alternative Display Product Details Method *******************
// function productDetailsTemplate(product) {
//   return `<section class="product-detail"> <h3>${product.Brand.Name}</h3>
//     <h2 class="divider">${product.NameWithoutBrand}</h2>
//     <img
//       class="divider"
//       src="${product.Image}"
//       alt="${product.NameWithoutBrand}"
//    >
//     <p class="product-card__price">$${product.FinalPrice}</p>
//     <p class="product__color">${product.Colors[0].ColorName}</p>
//     <p class="product__description">
//     ${product.DescriptionHtmlSimple}
//     </p>
//     <div class="product-detail__add">
//       <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
//     </div></section>`;
// }
