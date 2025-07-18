// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product;
}

// Function to fetch HTML content from a given path
export async function loadTemplate(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const html = await response.text();
  return html;
}

// Function to render content into a parent element (for single templates like header/footer)
export function renderWithTemplate(template, parentElement) {
  parentElement.innerHTML = template;
}

// Function to get the number of items in the cart and display it
export function getCartCount() {
  const cartItems = getLocalStorage("so-cart"); // Assume "so-cart" is the key for cart items
  const countElement = document.getElementById("cart-count");

  if (countElement) {
    const count = cartItems ? cartItems.length : 0;
    countElement.textContent = count;
  }
}

// Function to load header and footer dynamically
export async function loadHeaderFooter() {
  const headerPath = "../public/partials/header.html";
  const footerPath = "../public/partials/footer.html";

  // Use absolute paths for loading templates since the js files are in different directories
  const headerTemplate = await loadTemplate(headerPath);
  const footerTemplate = await loadTemplate(footerPath);

  const headerElement = document.getElementById("main-header");
  const footerElement = document.getElementById("main-footer");

  if (headerElement && footerElement) {
    renderWithTemplate(headerTemplate, headerElement);
    renderWithTemplate(footerTemplate, footerElement);
    getCartCount(); // Update cart count after header is loaded
  }
}

// This function remains for rendering lists of items like product cards
export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false){
  const htmlStrings = list.map(templateFn);
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}