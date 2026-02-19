import axios from "axios";

const instance = axios.create({
  baseURL: "https://watisdis31.web.id",
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
