import type { User } from "~/types/user";
import type { AuthInput, AuthResponse, AuthResult, UpdateTokenResult } from "~/types/auth";
import type { Nullable } from "~/types/types";
import { loginQuery } from "~/graphQL/auth/auth.query";
import { signupMutation } from "~/graphQL/auth/auth.mutation";

export const useAuth = () => {
  const { fetchUser } = useUsers();
  const authId = computed<Nullable<string>>(() =>
    useCookie("authId").value ? (useCookie("authId").value as string) : null,
  );
  const authUser = useState<Nullable<User>>("authUser", () => null);
  const isLoading = ref<boolean>(false);
  const accessTokenCookie = computed<Nullable<string>>(() =>
    useCookie("token").value ? (useCookie("token").value as string) : null,
  );
  const refreshTokenCookie = computed<Nullable<string>>(() =>
    useCookie("refreshToken").value ? (useCookie("refreshToken").value as string) : null,
  );
  const isAuth = computed<boolean>(() => !!authUser.value && !!accessTokenCookie.value);

  const { onLogin, onLogout, clients } = useApollo();

  const loadAuthUser = async () => {
    if (authId.value) {
      authUser.value = await fetchUser(authId.value);
    }
  };

  const login = async (email: string, password: string): Promise<Nullable<AuthResult>> => {
    isLoading.value = true;
    const { data } = await useAsyncQuery<Record<"auth", AuthInput>, AuthResponse>(loginQuery, {
      auth: { email, password },
    });
    if (data.value) {
      return saveAuthData(data.value.login);
    }
    isLoading.value = false;
    return null;
  };

  const signup = async (email: string, password: string): Promise<Nullable<AuthResult>> => {
    isLoading.value = true;
    if (clients) {
      const { data } = await clients.default.mutate({
        mutation: signupMutation,
        variables: { auth: { email, password } },
      });
      if (data) {
        return saveAuthData(data.signup);
      }
    }
    isLoading.value = false;
    throw new Error("Apollo clients is empty");
  };

  const saveAuthData = (data: Nullable<AuthResult>): Nullable<AuthResult> => {
    if (data) {
      const token = data.access_token;
      authUser.value = data.user as User;
      useCookie("refreshToken").value = data.refresh_token;
      useCookie("authId").value = data.user.id;
      onLogin(token);
      isLoading.value = false;
    }
    return data;
  };

  const logout = (): void => {
    isLoading.value = true;
    onLogout();
    useCookie("authId").value = null;
    useCookie("refreshToken").value = null;
    navigateTo("/auth/login");
    isLoading.value = false;
  };

  const refreshToken = async (): Promise<boolean> => {
    if (!refreshTokenCookie.value) {
      return false;
    }
    try {
      const graphqlUrl: string = import.meta.env.VITE_GRAPHQL_URL;
      const response: Record<"data", UpdateTokenResult> = await $fetch(graphqlUrl, {
        method: "POST",
        body: {
          query: `
            mutation UpdateToken {
              updateToken {
                access_token
                refresh_token
              }
            }
          `,
        },
        headers: {
          Authorization: `Bearer ${refreshTokenCookie.value}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.updateToken) {
        const token = response.data.updateToken.access_token;
        onLogin(token);
        useCookie("refreshToken").value = response.data.updateToken.refresh_token;
        return true;
      }

      return false;
    } catch {
      return false;
    }
  };

  return {
    authUser,
    isLoading,

    accessTokenCookie,
    refreshToken,
    isAuth,
    authId,

    login,
    signup,
    logout,
    loadAuthUser,
  };
};
