import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { useAuth } from "@/composables/useAuth";

const {
  mockFetchUser,
  mockOnLogin,
  mockOnLogout,
  mockMutate,
  mockUseAsyncQuery,
  apolloClientsRef,
} = vi.hoisted(() => ({
  mockFetchUser: vi.fn(),
  mockOnLogin: vi.fn(),
  mockOnLogout: vi.fn(),
  mockMutate: vi.fn(),
  mockUseAsyncQuery: vi.fn(),
  apolloClientsRef: { hasClients: true },
}));

const cookieStore: Record<string, { value }> = {
  authId: { value: null },
  token: { value: null },
  refreshToken: { value: null },
};

mockNuxtImport("useUsers", () => () => ({ fetchUser: mockFetchUser }));
mockNuxtImport("useApollo", () => () => ({
  onLogin: mockOnLogin,
  onLogout: mockOnLogout,
  clients: apolloClientsRef.hasClients ? { default: { mutate: mockMutate } } : null,
}));
mockNuxtImport("useCookie", () => (name: string) => cookieStore[name] ?? { value: null });
mockNuxtImport("useAsyncQuery", () => mockUseAsyncQuery);

vi.mock("@/graphQL/auth/auth.query", () => ({ loginQuery: "mocked login query" }));
vi.mock("@/graphQL/auth/auth.mutation", () => ({ signupMutation: "mocked signup mutation" }));

describe("useAuth", () => {
  beforeEach(() => {
    cookieStore.authId.value = null;
    cookieStore.token.value = null;
    cookieStore.refreshToken.value = null;
  });

  describe("computed properties", () => {
    it("returns authId from cookie", () => {
      cookieStore.authId.value = "123";
      const { authId } = useAuth();
      expect(authId.value).toBe("123");
    });

    it("returns null authId when cookie is empty", () => {
      const { authId } = useAuth();
      expect(authId.value).toBeNull();
    });

    it("returns isAuth true when user and token exist", () => {
      cookieStore.token.value = "token123";
      const { isAuth, authUser } = useAuth();
      authUser.value = { id: "123", name: "Test" };
      expect(isAuth.value).toBe(true);
    });

    it("returns isAuth false when no token", () => {
      const { isAuth } = useAuth();
      expect(isAuth.value).toBe(false);
    });
  });

  describe("loadAuthUser", () => {
    it("loads user when authId exists", async () => {
      cookieStore.authId.value = "123";
      mockFetchUser.mockResolvedValue({ id: "123", name: "Loaded User" });

      const { loadAuthUser, authUser } = useAuth();
      await loadAuthUser();

      expect(mockFetchUser).toHaveBeenCalledWith("123");
      expect(authUser.value).toEqual({ id: "123", name: "Loaded User" });
    });

    it("does nothing when no authId", async () => {
      const { loadAuthUser } = useAuth();
      await loadAuthUser();
      expect(mockFetchUser).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("successfully logs in and saves data", async () => {
      const mockData = {
        value: {
          login: {
            access_token: "new-token",
            refresh_token: "new-refresh",
            user: { id: "456", name: "New User" },
          },
        },
      };
      mockUseAsyncQuery.mockReturnValue({ data: mockData });

      const { login, authUser, isLoading } = useAuth();
      const result = await login("test@test.com", "password");

      expect(result).toEqual(mockData.value.login);
      expect(authUser.value).toEqual({ id: "456", name: "New User" });
      expect(isLoading.value).toBe(false);
    });

    it("returns null when login fails", async () => {
      mockUseAsyncQuery.mockReturnValue({ data: { value: null } });

      const { login, isLoading } = useAuth();
      const result = await login("test@test.com", "password");

      expect(result).toBeNull();
      expect(isLoading.value).toBe(false);
    });
  });

  describe("signup", () => {
    it("successfully signs up and saves data", async () => {
      mockMutate.mockResolvedValue({
        data: {
          signup: {
            access_token: "new-token",
            refresh_token: "new-refresh",
            user: { id: "789", name: "New User" },
          },
        },
      });

      const { signup, authUser, isLoading } = useAuth();
      const result = await signup("test@test.com", "password");

      expect(authUser.value).toEqual({ id: "789", name: "New User" });
      expect(isLoading.value).toBe(false);
      expect(result).toBeTruthy();
    });

    it("throws error when no apollo clients", async () => {
      apolloClientsRef.hasClients = false;
      const { signup } = useAuth();
      await expect(signup("test@test.com", "password")).rejects.toThrow("Apollo clients is empty");
      apolloClientsRef.hasClients = true;
    });
  });

  describe("logout", () => {
    it("clears auth data", () => {
      cookieStore.authId.value = "123";
      cookieStore.refreshToken.value = "refresh";

      const { logout, authUser, isLoading } = useAuth();
      authUser.value = { id: "123", name: "Test" };
      logout();

      expect(mockOnLogout).toHaveBeenCalled();
      expect(cookieStore.authId.value).toBeNull();
      expect(cookieStore.refreshToken.value).toBeNull();
      expect(isLoading.value).toBe(false);
    });
  });

  describe("refreshToken", () => {
    it("successfully refreshes token", async () => {
      cookieStore.refreshToken.value = "old-refresh";

      const mockFetch = vi.fn().mockResolvedValue({
        data: {
          updateToken: {
            access_token: "new-access",
            refresh_token: "new-refresh",
          },
        },
      });
      global.$fetch = mockFetch;

      const { refreshToken } = useAuth();
      const result = await refreshToken();

      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: { Authorization: "Bearer old-refresh", "Content-Type": "application/json" },
        }),
      );
    });

    it("returns false when no refresh token", async () => {
      const { refreshToken } = useAuth();
      expect(await refreshToken()).toBe(false);
    });

    it("returns false when refresh fails", async () => {
      cookieStore.refreshToken.value = "old-refresh";
      global.$fetch = vi.fn().mockRejectedValue(new Error("Network error"));

      const { refreshToken } = useAuth();
      expect(await refreshToken()).toBe(false);
    });

    it("returns false when response has no updateToken", async () => {
      cookieStore.refreshToken.value = "old-refresh";
      global.$fetch = vi.fn().mockResolvedValue({ data: { updateToken: null } });

      const { refreshToken } = useAuth();
      expect(await refreshToken()).toBe(false);
    });
  });
});
