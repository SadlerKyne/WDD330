import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const baseURL = import.meta.env.VITE_SERVER_URL;
const services = new ExternalServices();

export default class CheckoutProcess {
  constructor(outputSelector) {
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage("so-cart") || [];
    this.calculateItemSummary();
    if (this.list.length > 0) {
      this.renderOrderSummary();
    }
  }

  calculateItemSummary() {
    this.itemTotal = this.list.reduce(
      (sum, item) => sum + item.FinalPrice,
      0
    );
  }

  calculateOrderTotals() {
    // Tax: 6% sales tax on the subtotal amount
    this.tax = this.itemTotal * 0.06;

    // Shipping: $10 for the first item plus $2 for each additional item
    this.shipping = 10 + (this.list.length - 1) * 2;
    if (this.list.length === 0) {
      this.shipping = 0; // No shipping if no items
    }

    this.orderTotal = this.itemTotal + this.shipping + this.tax;
  }

  renderOrderSummary() {
    this.calculateOrderTotals();
    document.getElementById("subtotal").textContent = this.itemTotal.toFixed(2);
    document.getElementById("tax").textContent = this.tax.toFixed(2);
    document.getElementById("shipping").textContent = this.shipping.toFixed(2);
    document.getElementById("orderTotal").textContent = this.orderTotal.toFixed(2);
  }

  async checkout(form) {
    const formData = new FormData(form);
    const order = {
      orderDate: new Date().toISOString(),
      fname: formData.get("fname"),
      lname: formData.get("lname"),
      street: formData.get("street"),
      city: formData.get("city"),
      state: formData.get("state"),
      zip: formData.get("zip"),
      cardNumber: formData.get("cardNumber"),
      expiration: formData.get("expiration"),
      code: formData.get("code"),
      items: this.packageItems(this.list),
      orderTotal: this.orderTotal.toFixed(2),
      shipping: this.shipping.toFixed(2),
      tax: this.tax.toFixed(2),
    };

    try {
      const res = await services.checkout(order);
      console.log(res); // Log the success response
      setLocalStorage("so-cart", []); // Clear the cart after successful order
      window.location.href = "../checkout/success.html"; // Redirect to success page
    } catch (err) {
      console.error(err); // Log the error for debugging
      alert(`Order Failed: ${err.message}`); // Simple alert for failure
    }
  }

  // Helper function to transform cart items
  packageItems(items) {
    return items.map((item) => ({
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice,
      quantity: 1, // Assuming quantity is 1 per item 
    }));
  }
}