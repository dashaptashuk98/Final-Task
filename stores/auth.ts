import { defineStore } from "pinia";
import type { AxiosError } from "axios";
import axios from "axios";
import { ref, computed } from "vue";
import type { User } from "../types/user";
import type {
  LoginCredentials,
  LoginResponse,
  ApiErrorResponse,
  RefreshResponse,
} from "../types/auth";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const _accessToken = ref<string | null>(null);
  const _refreshToken = ref<string | null>(null);

  const accessToken = computed(() => _accessToken.value);
  const refreshToken = computed(() => _refreshToken.value);
  const isAuthenticated = computed(() => !!user.value && !!_accessToken.value);

  function loadFromStorage() {
    if (import.meta.client) {
      const savedAccessToken = localStorage.getItem("access_token");
      const savedRefreshToken = localStorage.getItem("refresh_token");
      const savedUser = localStorage.getItem("user");

      if (savedAccessToken) {
        _accessToken.value = savedAccessToken;
      }

      if (savedRefreshToken) {
        _refreshToken.value = savedRefreshToken;
      }

      if (savedUser) {
        try {
          user.value = JSON.parse(savedUser);
        } catch {
          // Игнорируем ошибку парсинга
        }
      }
    }
  }

  function saveToStorage() {
    if (import.meta.client) {
      if (_accessToken.value) {
        localStorage.setItem("access_token", _accessToken.value);
      }
      if (_refreshToken.value) {
        localStorage.setItem("refresh_token", _refreshToken.value);
      }
      if (user.value) {
        localStorage.setItem("user", JSON.stringify(user.value));
      }
    }
  }

  function clearStorage() {
    if (import.meta.client) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
    }
  }

  loadFromStorage();

  async function login(credentials: LoginCredentials) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await axios.post<
        LoginResponse & { access_token?: string; refresh_token?: string }
      >("/api/login", credentials, { withCredentials: true });

      if (response.data.success && response.data.user) {
        user.value = response.data.user;

        if (response.data.access_token) {
          _accessToken.value = response.data.access_token;
        }

        if (response.data.refresh_token) {
          _refreshToken.value = response.data.refresh_token;
        }

        saveToStorage();

        return {
          success: true,
          user: response.data.user,
        };
      }

      const errorMessage = response.data.message || "Неверный email или пароль";
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } catch (err) {
      let errorMessage = "Ошибка при входе";

      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ApiErrorResponse>;
        errorMessage =
          axiosError.response?.data?.error || axiosError.response?.data?.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      isLoading.value = false;
    }
  }

  async function refreshAccessToken(): Promise<string | null> {
    try {
      const currentRefreshToken =
        _refreshToken.value || (import.meta.client ? localStorage.getItem("refresh_token") : null);

      if (!currentRefreshToken) {
        return null;
      }

      const response = await axios.post<RefreshResponse>(
        "/api/refresh",
        { refresh_token: currentRefreshToken },
        { withCredentials: true },
      );

      if (response.data.success && response.data.updateToken?.access_token) {
        _accessToken.value = response.data.updateToken.access_token;
        _refreshToken.value = response.data.updateToken.refresh_token;

        saveToStorage();

        return response.data.updateToken.access_token;
      }

      return null;
    } catch {
      return null;
    }
  }

  async function logout() {
    isLoading.value = true;

    try {
      await axios.post("/api/logout", {}, { withCredentials: true });
    } catch {
      // чтобы не ругалось
    } finally {
      user.value = null;
      _accessToken.value = null;
      _refreshToken.value = null;
      error.value = null;
      isLoading.value = false;

      clearStorage();
    }
  }

  function clearError() {
    error.value = null;
  }

  function reloadUser() {
    loadFromStorage();
  }

  return {
    user,
    isLoading,
    error,
    accessToken,
    refreshToken,
    isAuthenticated,
    login,
    logout,
    refreshAccessToken,
    clearError,
    reloadUser,
  };
});
