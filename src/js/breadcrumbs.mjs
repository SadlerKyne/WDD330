export function renderBreadcrumbs(context) {
  const container = document.getElementById("breadcrumbs");
  if (!container) return;

  // Show breadcrumbs only if we have a category or a product
    if (!context.category && context.page !== "product-detail") {
    container.style.display = "none";
    return;
  }

  let html = "";

  if (context.page === "product-list" && context.category) {
    html = `<span>${context.category} → (${context.count} items)</span>`;
  } else if (context.page === "product-detail" && context.category) {
    html = `<span>${context.category}</span>`;
  }

  container.innerHTML = html;
  container.style.display = "block";
}
