import axios from "axios";

export const api = axios.create({
  baseURL: "https://app-vendas-rmp.onrender.com"
});
