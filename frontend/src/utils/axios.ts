import axios from "axios";
import { notifications } from "@mantine/notifications";

const baseURL = import.meta.env.VITE_API_HOST ?? "http://localhost:8000/api";

axios.defaults.baseURL = baseURL;
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
    const message =
      (typeof data?.error === "string" ? data.error : null) ??
      data?.message ??
      (error.code === "ERR_NETWORK" ? "Cannot reach API. Is it running at " + (axios.defaults.baseURL ?? "?") + "? Check CORS and API URL." : null) ??
      error.message ??
      "An error occurred.";
    notifications.show({
      title: "Error",
      message,
      color: "red",
      autoClose: 6000,
    });
    return Promise.reject(error);
  }
);

export default axios;
