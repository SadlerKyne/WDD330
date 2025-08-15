import { getLocalStorage, setLocalStorage, getCartCount } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }


  async init(category) {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails(category || this.product.category);
    this.addCommentsSection();

    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }


  addCommentsSection() {
    const productSection = document.querySelector(".product-detail");


    const commentsHTML = `
      <div class="simple-comments">
        <h3>Customer Comments</h3>

        <div class="add-comment">
          <input type="text" id="user-name" placeholder="Your name" />
          <textarea id="comment-text" placeholder="Write your comment..."></textarea>

          <button id="addCommentBtn">Add Comment</button>

        </div>

        <div id="comments-list"></div>
      </div>
    `;

    productSection.insertAdjacentHTML("beforeend", commentsHTML);

    document
      .getElementById("addCommentBtn")
      .addEventListener("click", this.addComment.bind(this));

    this.displayComments();
  }

  addComment() {
    const name = document.getElementById("user-name").value.trim();
    const text = document.getElementById("comment-text").value.trim();

    if (!name || !text) {
      alert("Please fill in both fields");
      return;
    }


    const comments = getLocalStorage(`comments-${this.productId}`) || [];

    comments.push({
      name: name,
      text: text,
      date: new Date().toLocaleDateString(),
    });

    setLocalStorage(`comments-${this.productId}`, comments);

    document.getElementById("user-name").value = "";
    document.getElementById("comment-text").value = "";


    this.displayComments();
  }

  displayComments() {
    const comments = getLocalStorage(`comments-${this.productId}`) || [];
    const commentsList = document.getElementById("comments-list");

    if (comments.length === 0) {
      commentsList.innerHTML = "<p>No comments yet. Be the first!</p>";
      return;
    }



    commentsList.innerHTML = comments
      .map(
        (comment) => `
        <div class="comment">
          <strong>${comment.name}</strong> - ${comment.date}
          <p>${comment.text}</p>
        </div>

      `

      )
      .join("");
  }

  addProductToCart() {

    const cartItems = getLocalStorage("so-cart") || [];

    const existingProductIndex = cartItems.findIndex(
      (item) => item.Id === this.product.Id,
    );

    if (existingProductIndex > -1) {
      cartItems[existingProductIndex].quantity += 1;
    } else {
      this.product.quantity = 1;
      cartItems.push(this.product);
    }

    setLocalStorage("so-cart", cartItems);
    getCartCount();
  }

  renderProductDetails(category) {
    const breadcrumbElement = document.getElementById("breadcrumbs");
    if (category) {
      const categoryTitle =
        category.replace("-", " ").charAt(0).toUpperCase() +
        category.slice(1);
      breadcrumbElement.innerHTML = `&gt;&gt; <a href="/product_listing/index.html?category=${category}">${categoryTitle}</a>`;
    }
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  document.querySelector("h3").textContent = product.Brand.Name;
  document.querySelector("h2.divider").textContent = product.NameWithoutBrand;

  const productImage = document.getElementById("productImage");


  let imgSrc = product.Images ? product.Images.PrimaryLarge : product.Image;

  if (imgSrc && imgSrc.startsWith("../")) {
    imgSrc = imgSrc.replace("../", "/");
  }

  productImage.src = imgSrc;

  productImage.alt = product.NameWithoutBrand;
  product.Image = imgSrc;


  if (!product.Name) {
    product.Name = `${product.Brand.Name} ${product.NameWithoutBrand}`;
  }


  const originalPrice = product.SuggestedRetailPrice || product.FinalPrice;
  const finalPrice = product.FinalPrice;
  const hasDiscount = originalPrice && originalPrice > finalPrice;
  const priceElement = document.getElementById("productPrice");

  if (hasDiscount) {
    const discountAmount = originalPrice - finalPrice;
    const discountPercentage = Math.round(
      (discountAmount / originalPrice) * 100
    );

    priceElement.innerHTML = `
      <span class="price__original">$${originalPrice.toFixed(2)}</span><br>
      <span class="price__final">$${finalPrice.toFixed(2)}</span>
      <span class="price__discount">SAVE $${discountAmount.toFixed(
        2
      )} (${discountPercentage}% OFF)</span>
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


