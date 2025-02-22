// api.js
import axios from "axios";

const API_BASE_URL = "http://192.168.1.6:3334/api/v0";

export const fetchProducts = async (page, size, keyword) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getproducts`, {
      params: {
        page: page,
        size: size,
        keyword: keyword,
      },
    });
    return response.data.result;
  } catch (error) {
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getcategoris`);
    return response.data.result;
  } catch (error) {
    throw error;
  }
};

export const register = async (user) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, user);
    return response.data.result;
  } catch (error) {
    throw error;
  }
};
