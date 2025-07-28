import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  // Discount Calculator (if applicable)
  const originalPrice = product.SuggestedRetailPrice;
  const finalPrice = product.FinalPrice;
  let discountHTML = '';

  if (originalPrice > finalPrice) {
    const discountPercentage = Math.round(
      ((originalPrice - finalPrice) / originalPrice) * 100,
    );
    discountHTML = `
      <p class="product-card__price--original">$${originalPrice.toFixed(2)}</p>
      <p class="product-card__discount">(${discountPercentage}% OFF)</p>
    `;
  }

  return `
    <li class="product-card">
      <a href="/product_pages/?product=${product.Id}">
        <img src="${product.Images.PrimaryMedium}" alt="${product.NameWithoutBrand}">
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.NameWithoutBrand}</h2>
        ${discountHTML} 
        <p class="product-card__price">$${finalPrice.toFixed(2)}</p>
      </a>
    </li>
    `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);
    document.querySelector(".title").textContent = 
      this.category.charAt(0).toUpperCase() + this.category.slice(1);
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}
