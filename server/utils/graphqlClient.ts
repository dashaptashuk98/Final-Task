import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { GraphQLError } from "../../app/types/auth";
import { useAuth } from "../../app/composables/useAuth";

const GRAPHQL_URL = process.env.VITE_GRAPHQL_URL || "http://localhost:3001/api/graphql";

interface ErrorResponse {
  errors?: GraphQLError[];
  message?: string;
}

export const graphqlClient = axios.create({
  baseURL: GRAPHQL_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

graphqlClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (import.meta.client) {
      const { accessToken } = useAuth();
      const token = accessToken.value;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

interface ExtendedRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

graphqlClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as ExtendedRequestConfig;

    if (!error.response || !import.meta.client) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshAccessToken } = useAuth();
        const newToken = await refreshAccessToken();

        if (newToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
