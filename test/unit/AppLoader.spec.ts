import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AppLoader from "@/components/AppLoader.vue";

const globalStubs = {
  global: {
    stubs: {
      Transition: {
        template: `<div><slot /></div>`,
      },
    },
  },
};

describe("AppLoader", () => {
  describe("rendering", () => {
    it("renders overlay when visible is true", () => {
      const wrapper = mount(AppLoader, {
        props: { visible: true },
        ...globalStubs,
      });

      expect(wrapper.find(".loader-overlay").exists()).toBe(true);
    });

    it("does not render overlay when visible is false", () => {
      const wrapper = mount(AppLoader, {
        props: { visible: false },
        ...globalStubs,
      });

      expect(wrapper.find(".loader-overlay").exists()).toBe(false);
    });

    it("renders spinner inside overlay when visible is true", () => {
      const wrapper = mount(AppLoader, {
        props: { visible: true },
        ...globalStubs,
      });

      expect(wrapper.find(".loader-spinner").exists()).toBe(true);
    });

    it("hides spinner when visible is false", () => {
      const wrapper = mount(AppLoader, {
        props: { visible: false },
        ...globalStubs,
      });

      expect(wrapper.find(".loader-spinner").exists()).toBe(false);
    });
  });

  describe("reactivity", () => {
    it("shows overlay when visible changes from false to true", async () => {
      const wrapper = mount(AppLoader, {
        props: { visible: false },
        ...globalStubs,
      });

      expect(wrapper.find(".loader-overlay").exists()).toBe(false);

      await wrapper.setProps({ visible: true });

      expect(wrapper.find(".loader-overlay").exists()).toBe(true);
    });

    it("hides overlay when visible changes from true to false", async () => {
      const wrapper = mount(AppLoader, {
        props: { visible: true },
        ...globalStubs,
      });

      expect(wrapper.find(".loader-overlay").exists()).toBe(true);

      await wrapper.setProps({ visible: false });

      expect(wrapper.find(".loader-overlay").exists()).toBe(false);
    });
  });
});
