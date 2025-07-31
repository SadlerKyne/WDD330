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
  // REMOVED ../PUBLIC FROM THE PATH AS IT WAS TELLING THE BUILD TO GO UP 1 LEVEL TOO FAR
  const headerPath = "/partials/header.html";
  const footerPath = "/partials/footer.html";

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
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false,
) {
  const htmlStrings = list.map(templateFn);

  if (clear) {
    parentElement.innerHTML = "";
  }

  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function alertMessage(message, scroll = true) {
  // create element to hold the alert
  const alert = document.createElement("div");
  // add a class to style the alert
  alert.classList.add("alert");

  // set the contents with message and close button
  alert.innerHTML = `
    <span class="alert-message">${message}</span>
    <button type="button" class="alert-close">X</button>
  `;

  // add the alert to the top of main
  const main = document.querySelector("main");

  // add a listener to the alert to see if they clicked on the X
  alert.addEventListener("click", function (e) {
    if (
      e.target.tagName === "BUTTON" &&
      e.target.classList.contains("alert-close")
    ) {
      e.preventDefault(); // Prevent any form submission
      e.stopPropagation(); // Stop event bubbling
      this.remove(); // Use remove() instead of removeChild()
    }
  });

  main.prepend(alert);

  // make sure they see the alert by scrolling to the top of the window
  if (scroll) {
    window.scrollTo(0, 0);
  }
}
