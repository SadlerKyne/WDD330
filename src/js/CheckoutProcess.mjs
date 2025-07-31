import { getLocalStorage, setLocalStorage, alertMessage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

export default class CheckoutProcess {
  constructor(outputSelector) {
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
    this.isProcessing = false; // Flag to prevent multiple submissions
  }

  init() {
    this.list = getLocalStorage("so-cart") || [];
    this.calculateItemSummary();
    if (this.list.length > 0) {
      this.renderOrderSummary();
    }
  }

  calculateItemSummary() {
    // Fix: Calculate total including quantity
    this.itemTotal = this.list.reduce(
      (sum, item) => sum + item.FinalPrice * (item.quantity || 1),
      0,
    );
  }

  calculateOrderTotals() {
    // Tax: 6% sales tax on the subtotal amount
    this.tax = this.itemTotal * 0.06;

    // Shipping: $10 for the first item plus $2 for each additional item
    // Calculate total quantity for shipping
    const totalQuantity = this.list.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0,
    );
    this.shipping = 10 + (totalQuantity - 1) * 2;
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
    document.getElementById("orderTotal").textContent =
      this.orderTotal.toFixed(2);
  }

  async checkout(form) {
    // Prevent multiple submissions
    if (this.isProcessing) {
      return;
    }
    this.isProcessing = true;

    // Clear any existing alerts
    this.clearAlerts();

    // Disable submit button and show loading state
    const submitButton = form.querySelector("button[type='submit']");
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Processing...";

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
      await services.checkout(order);
      setLocalStorage("so-cart", []); // Clear the cart after successful order
      window.location.href = "../checkout/success.html"; // Redirect to success page
    } catch (err) {
      // Handle different error formats and show individual error messages
      if (err.message && typeof err.message === "object") {
        // Parse individual validation errors
        const errors = err.message;
        Object.entries(errors).forEach(([, message]) => {
          alertMessage(message, false); // Don't scroll for multiple errors
        });
      } else if (err.message && typeof err.message === "string") {
        alertMessage(err.message);
      } else {
        alertMessage("Order Failed: Unknown error occurred");
      }
    } finally {
      // Reset processing flag and restore button
      this.isProcessing = false;
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  }

  // Helper method to clear existing alerts
  clearAlerts() {
    const existingAlerts = document.querySelectorAll(".alert");
    existingAlerts.forEach((alert) => alert.remove());
  }

  // Helper function to transform cart items - Fixed to use actual quantity
  packageItems(items) {
    return items.map((item) => ({
      id: item.Id,
      name:
        item.Name ||
        `${item.Brand?.Name || ""} ${item.NameWithoutBrand || ""}`.trim(),
      price: item.FinalPrice,
      quantity: item.quantity || 1, // Use actual quantity from cart
    }));
  }
}
