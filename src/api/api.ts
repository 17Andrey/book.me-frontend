import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000"})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {return Promise.reject(error);}
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Сообщаем приложению, что нужно разлогиниться
      window.dispatchEvent(new Event('logout'));
    }
    return Promise.reject(error);
  }
);