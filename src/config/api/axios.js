import axios from "axios";

const api = axios.create({
  baseURL: "https://bk-general-health.onrender.com",
});

export default api;