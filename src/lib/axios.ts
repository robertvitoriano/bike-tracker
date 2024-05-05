import axios from "axios";
import { env } from "../../env";
import { useAuthStore } from "./store/authStore";
export const api = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
});
const requestIntercepter = (config) => {
  //@ts-ignore
  config.headers.Authorization = "Bearer " + useAuthStore.getState()?.token;
  return config;
};

api.interceptors.request.use(requestIntercepter);
api.interceptors.request.use(requestIntercepter);

api.interceptors.response.use(
  (response) => response,
  (err) => {
    const authorizedUserError =
      err.response && err.response.status !== 401 && err.response.status < 500;
    const unauthorizedUserError = err.response && err.response.status === 401;
    if (unauthorizedUserError) {
      localStorage.clear();
      location.reload();
      return Promise.reject(null);
    }

    if (authorizedUserError) {
      console.error(err);
      return Promise.reject(err);
    }
  }
);

if (env.VITE_ENABLE_API_DELAY) {
  api.interceptors.request.use(async (config) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return config;
  });
}
