import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource; // instance of ExternalServices
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
      // Get cart from local storage, or initialize an empty array
    const cartItems = getLocalStorage("so-cart") || [];
    
    // Check if the product is already in the cart
    const existingProductIndex = cartItems.findIndex(
      (item) => item.Id === this.product.Id
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
  const originalPrice = product.SuggestedRetailPrice;
  const finalPrice = product.FinalPrice;
  const hasDiscount = originalPrice > finalPrice;

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