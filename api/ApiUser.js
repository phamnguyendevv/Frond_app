// api.js
import axios from "axios";
// import { API_BASE_URL } from "@env";

const API_BASE_URL = "http://192.168.1.6:3334/api/v0";

export const login = async (user) => {
  try {
    console.log("user", user);
    const response = await axios.post(`${API_BASE_URL}/login`, user);
    return response;
  } catch (error) {
    throw error;
  }
};

export const register = async (user) => {
  try {
    console.log("user", user);
    console.log(`${API_BASE_URL}/register`);
    const response = await axios.post(`${API_BASE_URL}/register`, user);
    console.log("response", response);
    return response.data.result;
  } catch (error) {
    throw error;
  }
};

export const forgetPassword = async (user) => {
  try {
    const email = { email: user };

    const response = await axios.post(`${API_BASE_URL}/forgot-password`, email);

    return response;
  } catch (error) {
    throw error;
  }
};

export const rePassword = async (user) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/reset-password`, user);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAddressesByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/address/${userId}`);
    return response.data.result;
  } catch (error) {
    throw error;
  }
};

export const fetchUserAddAddress = async (userId, address) => {
  try {
    data = {
      userId: userId,
      address: address,
    };
    console.log("data", data);
    const response = await axios.post(`${API_BASE_URL}/address`, {
      userId,
      address,
    });

    return response.data.result;
  } catch (error) {
    s;
    throw error;
  }
};

export const fetchUserDeleteAddress = async (userId, addressId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/address`, {
      data: {
        userId,
        addressId,
      },
    });
    return response.data.result;
  } catch (error) {
    throw error;
  }
};
