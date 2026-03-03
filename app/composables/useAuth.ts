import type { User } from "~/types/userTable";
import type {
  LoginCredentials,
  LoginResponse,
  ApiErrorResponse,
  RefreshResponse,
} from "~/types/auth";
import type { Nullable } from "~/types/types";

export const useAuth = () => {
  const user = useState<Nullable<User>>("auth:user", () => null);
  const isLoading = ref(false);
  const error = ref<Nullable<string>>(null);

  const _accessToken = useState<Nullable<string>>("auth:accessToken", () => null);
  const _refreshToken = useState<Nullable<string>>("auth:refreshToken", () => null);

  const accessToken = computed<Nullable<string>>(() => _accessToken.value);
  const refreshToken = computed<Nullable<string>>(() => _refreshToken.value);
  const isAuthenticated = computed<boolean>(() => !!user.value && !!_accessToken.value);

  function loadFromStorage(): void {
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
          user.value = JSON.parse(savedUser) as User;
        } catch {
          // игнор
        }
      }
    }
  }

  function saveToStorage(): void {
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

  function clearStorage(): void {
    if (import.meta.client) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
    }
  }

  loadFromStorage();

  async function login(credentials: LoginCredentials): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await $fetch<
        LoginResponse & {
          access_token?: string;
          refresh_token?: string;
        }
      >("/api/login", {
        method: "POST",
        body: credentials,
        credentials: "include",
      });

      if (data.success && data.user) {
        user.value = data.user;

        if (data.access_token) {
          _accessToken.value = data.access_token;
        }

        if (data.refresh_token) {
          _refreshToken.value = data.refresh_token;
        }

        saveToStorage();

        return {
          success: true,
          user: data.user,
        };
      }

      const errorMessage = data.message || "Неверный email или пароль";
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } catch (err: unknown) {
      let errorMessage = "Ошибка при входе";

      if (err && typeof err === "object" && "data" in err) {
        const errorData = err.data as ApiErrorResponse;
        errorMessage = errorData.error || errorData.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      isLoading.value = false;
    }
  }

  async function refreshAccessToken(): Promise<Nullable<string>> {
    try {
      const currentRefreshToken =
        _refreshToken.value || (import.meta.client ? localStorage.getItem("refresh_token") : null);

      if (!currentRefreshToken) {
        return null;
      }

      const data = await $fetch<RefreshResponse>("/api/refresh", {
        method: "POST",
        body: { refresh_token: currentRefreshToken },
        credentials: "include",
      });

      if (data.success && data.updateToken?.access_token) {
        _accessToken.value = data.updateToken.access_token;
        _refreshToken.value = data.updateToken.refresh_token;

        saveToStorage();

        return data.updateToken.access_token;
      }

      return null;
    } catch {
      return null;
    }
  }

  async function logout(): Promise<void> {
    isLoading.value = true;

    try {
      await $fetch("/api/logout", {
        method: "POST",
        body: {},
        credentials: "include",
      });
    } catch {
      //edrfghj
    } finally {
      user.value = null;
      _accessToken.value = null;
      _refreshToken.value = null;
      error.value = null;
      isLoading.value = false;

      clearStorage();
    }
  }

  function clearError(): void {
    error.value = null;
  }

  function reloadUser(): void {
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
};
