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
    // once the HTML is rendered, add a listener to the Add to Cart button
    // Notice the .bind(this). This callback will not work if the bind(this) is missing. Review the readings from this week on 'this' to understand why.
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
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
  const originalPrice = product.SuggestedRetailPrice;
  const finalPrice = product.FinalPrice;
  const hasDiscount = originalPrice > finalPrice;

  const priceElement = document.getElementById("productPrice");

  if (hasDiscount) {
    const discountAmount = originalPrice - finalPrice;
    const discountPercentage = Math.round(
      (discountAmount / originalPrice) * 100,
    );

    // Show original price, final price, and discount indicator using CSS classes
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
