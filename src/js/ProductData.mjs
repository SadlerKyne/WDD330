function convertToJson(res) {
  if (res.ok) {
    return res.json();
  }
  throw new Error("Bad Response");
}
export default class ProductData {
  constructor(category) {
    this.category = category;
    this.path = `../json/${this.category}.json`;
  }

  async getData() {
    try {
      const response = await fetch(this.path);
      return convertToJson(response);
    } catch (err) {
      console.error("Error fetching product data:", err);
      return [];
    }
  }

  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
  }
}
