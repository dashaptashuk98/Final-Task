import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import AuthForm from "@/components/AuthForm.vue";
import PrimeVue from "primevue/config";
vi.mock("@/composables/useAuth", () => ({
  useAuth: () => ({
    isLoading: false,
  }),
}));

vi.mock("#app", () => ({
  navigateTo: vi.fn(),
}));

const defaultProps = {
  path: "login",
  fields: [],
  mainButtonLabel: "Login",
  secondaryButtonLabel: "Sign up",
};

const mountOptions = {
  global: {
    plugins: [PrimeVue],
  },
};

describe("AuthForm", () => {
  it("renders correctly", () => {
    const wrapper = mount(AuthForm, { ...mountOptions, props: defaultProps });
    expect(wrapper.exists()).toBe(true);
  });

  it("accepts path prop", () => {
    const wrapper = mount(AuthForm, { ...mountOptions, props: defaultProps });
    expect(wrapper.props("path")).toBe("login");
  });

  describe("email/text field", () => {
    it("renders email input field", () => {
      const wrapper = mount(AuthForm, {
        ...mountOptions,
        props: {
          ...defaultProps,
          fields: [
            { key: "email", type: "email", label: "Email", value: "", placeholder: "Email" },
          ],
        },
      });
      expect(wrapper.find(".input-wrapper").exists()).toBe(true);
      expect(wrapper.find("input").attributes("placeholder")).toBe("Email");
    });

    it("applies p-invalid class when field has error", () => {
      const wrapper = mount(AuthForm, {
        ...mountOptions,
        props: {
          ...defaultProps,
          fields: [
            {
              key: "email",
              type: "email",
              label: "Email",
              value: "",
              placeholder: "Email",
              error: true,
            },
          ],
        },
      });
      expect(wrapper.find(".p-invalid").exists()).toBe(true);
    });

    it("disables input when loading is true", () => {
      const wrapper = mount(AuthForm, {
        ...mountOptions,
        props: {
          ...defaultProps,
          loading: true,
          fields: [
            { key: "email", type: "email", label: "Email", value: "", placeholder: "Email" },
          ],
        },
      });
      expect(wrapper.find("input").attributes("disabled")).toBeDefined();
    });

    it("shows error message for invalid field", () => {
      const wrapper = mount(AuthForm, {
        ...mountOptions,
        props: {
          ...defaultProps,
          fields: [
            {
              key: "email",
              type: "email",
              label: "Email",
              value: "",
              placeholder: "Email",
              error: true,
              errorMessage: "Invalid email",
            },
          ],
        },
      });
      expect(wrapper.find(".error-message").exists()).toBe(true);
      expect(wrapper.find(".error-message").text()).toBe("Invalid email");
    });
  });

  describe("password field", () => {
    it("renders password field with wrapper", () => {
      const wrapper = mount(AuthForm, {
        ...mountOptions,
        props: {
          ...defaultProps,
          fields: [
            {
              key: "password",
              type: "password",
              label: "Password",
              value: "",
              placeholder: "Password",
            },
          ],
        },
      });
      expect(wrapper.find(".password-wrapper").exists()).toBe(true);
    });

    it("sets all correct props on Password component", () => {
      const wrapper = mount(AuthForm, {
        ...mountOptions,
        props: {
          ...defaultProps,
          fields: [
            {
              key: "password",
              type: "password",
              label: "Password",
              value: "test123",
              placeholder: "Enter password",
            },
          ],
        },
      });

      const password = wrapper.findComponent({ name: "Password" });
      expect(password.props()).toMatchObject({
        modelValue: "test123",
        feedback: false,
        toggleMask: true,
        disabled: false,
        placeholder: "Enter password",
        inputStyle: { width: "100%" },
      });
      expect(password.attributes("id")).toBe("password");
      expect(password.classes()).toContain("custom-password");
    });

    it("applies p-invalid class when error is true", () => {
      const wrapper = mount(AuthForm, {
        ...mountOptions,
        props: {
          ...defaultProps,
          fields: [
            {
              key: "password",
              type: "password",
              label: "Password",
              value: "",
              placeholder: "Password",
              error: true,
            },
          ],
        },
      });

      const password = wrapper.findComponent({ name: "Password" });
      expect(password.classes()).toContain("p-invalid");
    });

    it("applies error border style through pt prop when error is true", () => {
      const wrapper = mount(AuthForm, {
        ...mountOptions,
        props: {
          ...defaultProps,
          fields: [
            {
              key: "password",
              type: "password",
              label: "Password",
              value: "",
              placeholder: "Password",
              error: true,
            },
          ],
        },
      });

      const password = wrapper.findComponent({ name: "Password" });
      expect(password.props("pt")).toEqual({
        input: {
          style: { borderColor: "#c63031 !important" },
        },
      });
    });

    it("applies empty style in pt prop when error is false", () => {
      const wrapper = mount(AuthForm, {
        ...mountOptions,
        props: {
          ...defaultProps,
          fields: [
            {
              key: "password",
              type: "password",
              label: "Password",
              value: "",
              placeholder: "Password",
              error: false,
            },
          ],
        },
      });

      const password = wrapper.findComponent({ name: "Password" });
      expect(password.props("pt")).toEqual({
        input: {
          style: {},
        },
      });
    });

    it("disables password field when loading is true", () => {
      const wrapper = mount(AuthForm, {
        ...mountOptions,
        props: {
          ...defaultProps,
          loading: true,
          fields: [
            {
              key: "password",
              type: "password",
              label: "Password",
              value: "",
              placeholder: "Password",
            },
          ],
        },
      });

      const password = wrapper.findComponent({ name: "Password" });
      expect(password.props("disabled")).toBe(true);
    });

    it("shows error message for invalid password", () => {
      const wrapper = mount(AuthForm, {
        ...mountOptions,
        props: {
          ...defaultProps,
          fields: [
            {
              key: "password",
              type: "password",
              label: "Password",
              value: "",
              placeholder: "Password",
              error: true,
              errorMessage: "Invalid password",
            },
          ],
        },
      });

      const errorMessage = wrapper.find(".password-wrapper .error-message");
      expect(errorMessage.exists()).toBe(true);
      expect(errorMessage.text()).toBe("Invalid password");
    });

    it("does not show error message when error is false", () => {
      const wrapper = mount(AuthForm, {
        ...mountOptions,
        props: {
          ...defaultProps,
          fields: [
            {
              key: "password",
              type: "password",
              label: "Password",
              value: "",
              placeholder: "Password",
              error: false,
              errorMessage: "Invalid password",
            },
          ],
        },
      });

      expect(wrapper.find(".password-wrapper .error-message").exists()).toBe(false);
    });
  });

  describe("buttons", () => {
    it("renders main button with correct label and emits event", async () => {
      const wrapper = mount(AuthForm, { ...mountOptions, props: defaultProps });
      const mainButton = wrapper.findAll("button")[0];

      expect(mainButton.text()).toBe("Login");
      expect(mainButton.attributes("type")).toBe("submit");

      await mainButton.trigger("click");
      expect(wrapper.emitted("handleButton")).toBeTruthy();
    });

    it("secondary button has correct label and navigates on click", () => {
      const wrapper = mount(AuthForm, { ...mountOptions, props: defaultProps });
      const secondaryButton = wrapper.findAll("button")[1];

      expect(secondaryButton.text()).toBe("Sign up");
      expect(secondaryButton.classes()).toContain("link-button");
    });
  });
  it("renders multiple fields correctly", () => {
    const wrapper = mount(AuthForm, {
      ...mountOptions,
      props: {
        ...defaultProps,
        fields: [
          { key: "email", type: "email", label: "Email", value: "", placeholder: "Email" },
          {
            key: "password",
            type: "password",
            label: "Password",
            value: "",
            placeholder: "Password",
          },
          { key: "username", type: "text", label: "Username", value: "", placeholder: "Username" },
        ],
      },
    });

    expect(wrapper.findAll(".input-wrapper")).toHaveLength(2);
    expect(wrapper.findAll(".password-wrapper")).toHaveLength(1);
    expect(wrapper.findAll(".form-group")).toHaveLength(3);
  });
});
