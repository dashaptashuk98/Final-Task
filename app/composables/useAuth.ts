import type { User } from "~/types/userTable";
import type { AuthInput, AuthResponse } from "~/types/auth";
import type { Nullable } from "~/types/types";
import { loginQuery } from "~/graphQL/auth/auth.query";
// import { updateTokenMutation } from "~/graphQL/auth/auth.mutation";

export const useAuth = () => {
  const authUser = useState<Nullable<User>>(() => null);
  const isLoading = ref(false);
  const accessToken = computed<Nullable<string>>(() =>
    useCookie("token").value ? (useCookie("token").value as string) : null,
  );
  const isAuth = computed<boolean>(() => !!authUser.value && !!accessToken.value);

  const { onLogin, onLogout } = useApollo();

  const login = async (email: string, password: string): Promise<Nullable<AuthResponse>> => {
    isLoading.value = true;
    const refreshTokenCookie = useCookie("refresh_token");
    const { data } = await useAsyncQuery<Record<"auth", AuthInput>, AuthResponse>(loginQuery, {
      auth: { email, password },
    });
    if (data.value) {
      const token = data.value.login.access_token;
      authUser.value = data.value.login.user as User;
      refreshTokenCookie.value = data.value.login.refresh_token;
      onLogin(token);
    }
    return data.value;
  };

  const logout = (): void => {
    onLogout();
    isLoading.value = false;
  };

  // async function refreshAccessToken(): Promise<Nullable<string>> {
  //   try {
  //     const currentRefreshToken =
  //       _refreshToken.value || (import.meta.client ? localStorage.getItem("refresh_token") : null);

  //     if (!currentRefreshToken) {
  //       return null;
  //     }

  //     const data = await $fetch<RefreshResponse>("/api/refresh", {
  //       method: "POST",
  //       body: { refresh_token: currentRefreshToken },
  //       credentials: "include",
  //     });

  //     if (data.success && data.updateToken?.access_token) {
  //       _accessToken.value = data.updateToken.access_token;
  //       _refreshToken.value = data.updateToken.refresh_token;

  //       return data.updateToken.access_token;
  //     }

  //     return null;
  //   } catch {
  //     return null;
  //   }
  // }

  // const refreshAgain = async () => {
  //   try {
  //     const { data } = await useAsyncQuery(updateTokenMutation);
  //     const newToken = data.value.updateToken.access_token;
  //     await onLogin(newToken);
  //   } catch (e) {
  //     console.error('Не удалось обновить токен:', e);
  //     await logoutAgain();
  //   }
  // };

  return {
    user: authUser,
    isLoading,

    accessToken,
    isAuthenticated: isAuth,

    login,
    logout,
    // refreshAgain
  };
};
