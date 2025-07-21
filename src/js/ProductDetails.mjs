export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    try {
      this.product = await this.dataSource.findProductById(this.productId);
      if (!this.product) throw new Error("Product not found");
      this.renderProductDetails();
      this.setupAddToCart();
    } catch (err) {
      console.error("Error initializing product:", err);
      document.querySelector("main").innerHTML = `<h2>${err.message}</h2>`;
    }
  }

  renderProductDetails() {
    document.getElementById("product-name").textContent = this.product.Name;
    document.getElementById("product-price").textContent = `$${this.product.FinalPrice}`;
    document.getElementById("product-image").src = this.product.Image;
    document.getElementById("product-image").alt = this.product.Name;
    document.getElementById("product-description").textContent = this.product.Description;

    // Optional: If your JSON includes a Brand field, display it
    if (this.product.Brand) {
      const brandEl = document.getElementById("product-brand");
      if (brandEl) brandEl.textContent = this.product.Brand;
    }
  }

  setupAddToCart() {
    const btn = document.getElementById("addToCart");
    if (btn) {
      btn.addEventListener("click", this.addToCart.bind(this));
    }
  }

  addToCart() {
    const cart = JSON.parse(localStorage.getItem("so-cart")) || [];
    cart.push(this.product);
    localStorage.setItem("so-cart", JSON.stringify(cart));
    alert(`${this.product.Name} added to cart!`);
  }
}
