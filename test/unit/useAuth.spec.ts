import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { useAuth } from "@/composables/useAuth";

const {
  mockQuery,
  mockMutate,
  mockUseAsyncQuery,
  onLoginMock,
  onLogoutMock,
  mockNavigateTo,
  mockCookies,
  mockFetchUser,
} = vi.hoisted(() => {
  const mockCookies: Record<string, Ref<string | null>> = {};

  return {
    mockQuery: vi.fn(),
    mockMutate: vi.fn(),
    mockUseAsyncQuery: vi.fn(),
    onLoginMock: vi.fn(),
    onLogoutMock: vi.fn(),
    mockNavigateTo: vi.fn(),
    mockCookies,
    mockFetch: vi.fn(),
    mockFetchUser: vi.fn(),
  };
});

mockNuxtImport("useCookie", () => (key: string) => {
  if (!mockCookies[key]) {
    mockCookies[key] = ref(null);
  }
  return mockCookies[key];
});

mockNuxtImport("useApollo", () => () => ({
  clients: { default: { query: mockQuery, mutate: mockMutate } },
  onLogin: onLoginMock,
  onLogout: onLogoutMock,
}));
mockNuxtImport("useAsyncQuery", () => mockUseAsyncQuery);
mockNuxtImport("navigateTo", () => mockNavigateTo);
mockNuxtImport("useUsers", () => () => ({
  fetchUser: mockFetchUser,
}));

vi.mock("@/graphQL/auth/auth.query", () => ({
  loginQuery: "Login",
}));
vi.mock("@/graphQL/auth/auth.mutation", () => ({
  signupMutation: "signup",
}));

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe("login", () => {
    it("user successfully logged in", async () => {
      mockUseAsyncQuery.mockReturnValue({
        data: ref({
          login: { user: { id: "610" } },
        }),
      });
      const { login } = useAuth();
      const result = await login("vladislav.ivanchikov15@gmail.com", "hrmtestpass");
      expect(onLoginMock).toHaveBeenCalled();
      expect(result).toEqual({ user: { id: "610" } });
    });
    it("resets isLoading after login", async () => {
      const { login, isLoading } = useAuth();
      await login("incorrect@credentials.com", "incorrect@credentials.com");

      expect(isLoading.value).toBe(false);
    });
  });
  describe("logout", () => {
    it("calls onLogout and clears cookies", () => {
      mockCookies["authId"] = ref("610");
      mockCookies["refreshToken"] = ref("some-refresh-token");

      const { logout } = useAuth();
      logout();

      expect(onLogoutMock).toHaveBeenCalled();
      expect(mockCookies["authId"].value).toBeNull();
      expect(mockCookies["refreshToken"].value).toBeNull();
    });

    it("navigates to login page after logout", () => {
      const { logout } = useAuth();
      logout();

      expect(mockNavigateTo).toHaveBeenCalledWith("/auth/login");
    });

    it("resets isLoading after logout", () => {
      const { logout, isLoading } = useAuth();
      logout();

      expect(isLoading.value).toBe(false);
    });
  });
  describe("signup", () => {
    it("creates new user", async () => {
      mockMutate.mockResolvedValue({
        data: {
          signup: { user: { id: "888" } },
        },
      });
      const { signup } = useAuth();
      const result = await signup("vladislav888@gmail.com", "hrmtestpass");
      expect(onLoginMock).toHaveBeenCalled();
      expect(result).toEqual({ user: { id: "888" } });
    });
  });

  describe("loadAuthUser", () => {
    it("fetches and sets authUser when authId is present", async () => {
      const mockUserData = { id: "610" };

      mockCookies["authId"] = ref("610");
      mockFetchUser.mockResolvedValue(mockUserData);

      const { loadAuthUser, authUser } = useAuth();
      await loadAuthUser();

      expect(mockFetchUser).toHaveBeenCalledWith("610");
      expect(authUser.value).toEqual(mockUserData);
    });

    it("does not call fetchUser when authId is null", async () => {
      mockCookies["authId"] = ref(null);

      const { loadAuthUser } = useAuth();
      await loadAuthUser();

      expect(mockFetchUser).not.toHaveBeenCalled();
    });
  });

  describe("refreshToken", () => {
    it("returns false if token equals null", async () => {
      const { refreshToken } = useAuth();
      mockCookies["token"] = ref(null);
      const result = await refreshToken();
      expect(result).toEqual(false);
    });
  });
});
