import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { useValidateAuth } from "@/composables/useValidateAuth";
import { useVuelidate } from "@vuelidate/core";

const mockLogin = vi.fn();
const mockSignup = vi.fn();
const mockToastAdd = vi.fn();
const mockRouterPush = vi.fn();
const mockRouteName = ref("auth-login");

mockNuxtImport("useAuth", () => () => ({
  login: mockLogin,
  signup: mockSignup,
}));

mockNuxtImport("useToast", () => () => ({
  add: mockToastAdd,
}));

mockNuxtImport("useRouter", () => () => ({
  push: mockRouterPush,
  afterEach: vi.fn(),
}));

mockNuxtImport("useRoute", () => () => ({
  name: mockRouteName.value,
}));

vi.mock("@vuelidate/core", () => ({
  useVuelidate: vi.fn(),
}));

const mockV$ = {
  value: {
    $touch: vi.fn(),
    $validate: vi.fn(),
    $errors: [],
    email: { $invalid: false, $dirty: false, $errors: [] },
    password: { $invalid: false, $dirty: false, $errors: [] },
  },
};

beforeEach(() => {
  vi.clearAllMocks();
  mockRouteName.value = "auth-login";
  mockV$.value.email = { $invalid: false, $dirty: false, $errors: [] };
  mockV$.value.password = { $invalid: false, $dirty: false, $errors: [] };
  useVuelidate.mockReturnValue(mockV$);
});

describe("useValidateAuth", () => {
  describe("initialization", () => {
    it("should initialize with default login fields", () => {
      const { loginFields } = useValidateAuth();
      expect(loginFields.value).toHaveLength(2);
      expect(loginFields.value[0].key).toBe("email");
      expect(loginFields.value[0].type).toBe("email");
      expect(loginFields.value[1].key).toBe("password");
      expect(loginFields.value[1].type).toBe("password");
    });

    it("should setup Vuelidate with correct rules", () => {
      useValidateAuth();
      expect(useVuelidate).toHaveBeenCalledWith(
        expect.objectContaining({
          email: expect.objectContaining({ required: expect.anything(), email: expect.anything() }),
          password: expect.objectContaining({
            required: expect.anything(),
            minLength: expect.anything(),
            maxLength: expect.anything(),
          }),
        }),
        expect.anything(),
      );
    });
  });

  describe("field validation", () => {
    it("should mark field as invalid when validation fails", () => {
      mockV$.value.email = {
        $invalid: true,
        $dirty: true,
        $errors: [{ $message: "Invalid email" }],
      };
      const { loginFields } = useValidateAuth();
      expect(loginFields.value[0].error).toBe(true);
      expect(loginFields.value[0].errorMessage).toBe("Invalid email");
    });

    it("should mark field as valid when validation passes", () => {
      mockV$.value.email = { $invalid: false, $dirty: true, $errors: [] };
      const { loginFields } = useValidateAuth();
      expect(loginFields.value[0].error).toBe(false);
      expect(loginFields.value[0].errorMessage).toBe("");
    });
  });

  describe("handleAuth - login flow", () => {
    beforeEach(() => {
      mockV$.value.$validate.mockResolvedValue(true);
      mockLogin.mockResolvedValue(true);
    });

    it("should successfully login with valid credentials", async () => {
      const { handleAuth } = useValidateAuth();
      await handleAuth();
      expect(mockV$.value.$touch).toHaveBeenCalled();
      expect(mockV$.value.$validate).toHaveBeenCalled();
      expect(mockLogin).toHaveBeenCalledWith("", "");
      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: "success",
        summary: "Success",
        detail: "Logged in successfully",
        life: 3000,
      });
      expect(mockRouterPush).toHaveBeenCalledWith("/users");
    });

    it("should handle login failure", async () => {
      mockLogin.mockResolvedValue(false);
      const { handleAuth } = useValidateAuth();
      await handleAuth();
      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: "error",
        summary: "Error",
        detail: "Incorrect credentials",
        life: 5000,
      });
      expect(mockRouterPush).not.toHaveBeenCalled();
    });

    it("should not proceed with invalid form", async () => {
      mockV$.value.$validate.mockResolvedValue(false);
      const { handleAuth } = useValidateAuth();
      await handleAuth();
      expect(mockLogin).not.toHaveBeenCalled();
    });
  });

  describe("handleAuth - signup flow", () => {
    beforeEach(() => {
      mockRouteName.value = "auth-signup";
      mockV$.value.$validate.mockResolvedValue(true);
      mockSignup.mockResolvedValue(true);
    });

    it("should successfully signup", async () => {
      const { handleAuth } = useValidateAuth();
      await handleAuth();
      expect(mockSignup).toHaveBeenCalledWith("", "");
      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: "success",
        summary: "Success",
        detail: "Account created",
        life: 3000,
      });
      expect(mockRouterPush).toHaveBeenCalledWith("/users");
    });

    it("should handle signup failure", async () => {
      mockSignup.mockResolvedValue(false);
      const { handleAuth } = useValidateAuth();
      await handleAuth();
      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: "error",
        summary: "Error",
        detail: "User is already exists",
        life: 5000,
      });
    });
  });

  describe("error handling", () => {
    beforeEach(() => {
      mockV$.value.$validate.mockResolvedValue(true);
    });

    it("should handle Error object", async () => {
      mockLogin.mockRejectedValue(new Error("Network error"));
      const { handleAuth } = useValidateAuth();
      await handleAuth();
      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: "error",
        summary: "Error",
        detail: "Network error",
        life: 5000,
      });
    });

    it("should handle string error", async () => {
      mockLogin.mockRejectedValue("String error");
      const { handleAuth } = useValidateAuth();
      await handleAuth();
      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: "error",
        summary: "Error",
        detail: "String error",
        life: 5000,
      });
    });

    it("should handle unknown error", async () => {
      mockLogin.mockRejectedValue({ some: "object" });
      const { handleAuth } = useValidateAuth();
      await handleAuth();
      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: "error",
        summary: "Error",
        detail: "Unexpected error",
        life: 5000,
      });
    });
  });
});
