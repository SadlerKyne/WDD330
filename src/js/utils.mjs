export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}


export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}


export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}


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

export async function loadTemplate(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const html = await response.text();
  return html;
}

export function renderWithTemplate(template, parentElement) {
  parentElement.innerHTML = template;
}

export function getCartCount() {
  const cartItems = getLocalStorage("so-cart") || [];
  const countElement = document.getElementById("cart-count");

  if (countElement) {
    const totalQuantity = cartItems.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );
    countElement.textContent = totalQuantity;
  }
}

export async function loadHeaderFooter() {
  const headerPath = "/partials/header.html";
  const footerPath = "/partials/footer.html";

  const headerTemplate = await loadTemplate(headerPath);
  const footerTemplate = await loadTemplate(footerPath);

  const headerElement = document.getElementById("main-header");
  const footerElement = document.getElementById("main-footer");

  if (headerElement && footerElement) {
    renderWithTemplate(headerTemplate, headerElement);
    renderWithTemplate(footerTemplate, footerElement);
    getCartCount();
  }
}


export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",

  clear = false

) {
  const htmlStrings = list.map(templateFn);

  if (clear) {
    parentElement.innerHTML = "";
  }

  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function alertMessage(message, scroll = true) {

  const alert = document.createElement("div");
  alert.classList.add("alert");

  alert.innerHTML = `
    <span class="alert-message">${message}</span>
    <button type="button" class="alert-close">X</button>
  `;


  const main = document.querySelector("main");


  alert.addEventListener("click", function (e) {
    if (
      e.target.tagName === "BUTTON" &&
      e.target.classList.contains("alert-close")
    ) {

      e.preventDefault();
      e.stopPropagation();
      this.remove();

    }
  });

  main.prepend(alert);

  if (scroll) {
    window.scrollTo(0, 0);
  }
}

