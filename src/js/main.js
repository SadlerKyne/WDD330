import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { getParam, getLocalStorage, loadHeaderFooter } from "./utils.mjs";
import { renderBreadcrumbs } from "./breadcrumbs.mjs";


window.addEventListener("DOMContentLoaded", () => {
    const category = getParam("category") || "tents";
    const dataSource = new ProductData(category);
    const listElement = document.querySelector(".product-list");
    const productList = new ProductList(category, dataSource, listElement);

    loadHeaderFooter().then(() => {
        const category1 = getParam("category");
        const product = getParam("product");

        if (category1) {
            const productData = getLocalStorage(category1) || [];
            renderBreadcrumbs({
            page: "product-list",
            category: category1,
            count: productData.length,
            });
        } else if (product) {
            const categoryGuess = "tents"; // You can improve this later
            renderBreadcrumbs({
            page: "product-detail",
            category: categoryGuess,
            });
        } else {
            renderBreadcrumbs({});
        }
        productList.init(); // Wait until after header loads
    });
});