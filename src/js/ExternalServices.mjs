const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(res) {
  const jsonResponse = await res.json(); //  try to parse JSON
  if (res.ok) {
    return jsonResponse;
  } else {

    throw { name: "servicesError", message: jsonResponse }; // Include jsonResponse in the error message 
  }
}

export default class ExternalServices {
  constructor() {}

  async getData(category) {
    const url = `${baseURL}products/search/${category}`;
    console.log(`Fetching from: ${url}`);
    const response = await fetch(url);
    const data = await convertToJson(response);
    return data.Result;
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async checkout(payload) {
    const options = {
      method: "POST", 
      headers: {
        "Content-Type": "application/json", // Set content type to JSON 
      },
      body: JSON.stringify(payload), 
    };
    const response = await fetch(`${baseURL}checkout`, options); // Send POST to checkout endpoint 
    const data = await convertToJson(response); // Process the response
    return data;
  }
}