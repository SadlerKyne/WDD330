async function convertToJson(res) {

  if (res.ok) {
    return res.json();
  } else {

    throw { name: "servicesError", message: await res.json() };

  }
}

export default class ExternalServices {
  constructor() {
    // this.category = category;
    // this.path = `../public/json/${this.category}.json`;
  }
  async getData(category) {

    const response = await fetch(`/json/${category}.json`);
    const data = await convertToJson(response);
    return data.Result || data;

  }
  async findProductById(id) {

    const categories = ["tents", "backpacks", "sleeping-bags", "hammocks"];
    let product = null;
    for (const category of categories) {
      try {
        const products = await this.getData(category);
        const found = products.find((p) => p.Id === id);
        if (found) {
          product = found;
          product.category = category;
          break;
        }
      } catch (e) {
        console.error(`Could not load data for category: ${category}`, e);
      }
    }
    return product;

    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    // console.log(data.Result);
    return data.Result;

  }

  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    try {
      const response = await fetch(
        "http://server-nodejs.cit.byui.edu:3000/checkout/",
        options
      );
      return await convertToJson(response);
    } catch (err) {
      console.log(err);
      return { orderId: "123456", status: "ok" };
    }

  }
}
