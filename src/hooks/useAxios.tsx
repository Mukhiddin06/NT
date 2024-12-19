import axios from "axios";
import { API } from "./useEnv";

export const axiosInstance = axios.create({
    baseURL: API,
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token")
        ? JSON.parse(localStorage.getItem("token") as string)
        : null;
  
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  export const useAxios = () => axiosInstance;
