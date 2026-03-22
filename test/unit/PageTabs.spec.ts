import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import PageTabs from "@/components/PageTabs.vue";

const { mockRoute } = vi.hoisted(() => ({
  mockRoute: { path: "/users/1/profile" },
}));

mockNuxtImport("useRoute", () => () => mockRoute);

const globalStubs = {
  global: {
    stubs: {
      Tabs: {
        props: ["value"],
        template: `<div :data-value="value" v-bind="$attrs" data-testid="tabs"><slot /></div>`,
      },
      TabList: {
        template: `<div data-testid="tab-list"><slot /></div>`,
      },
      Tab: {
        props: ["value"],
        template: `<div :data-value="value" data-testid="tab"><slot /></div>`,
      },
      TabPanels: {
        template: `<div data-testid="tab-panels"><slot /></div>`,
      },
      TabPanel: {
        props: ["value"],
        template: `<div :data-value="value" data-testid="tab-panel"><slot /></div>`,
      },
      NuxtLink: {
        props: ["to"],
        template: `<a :href="to" data-testid="nuxt-link"><slot /></a>`,
      },
    },
  },
};

const mockTabs = [
  { label: "Profile", to: "/users/1/profile" },
  { label: "Skills", to: "/users/1/skills" },
  { label: "CVs", to: "/users/1/cvs" },
];

describe("PageTabs", () => {
  beforeEach(() => {
    mockRoute.path = "/users";
  });

  describe("rendering", () => {
    it("renders a tab for each item in tabs prop", () => {
      const wrapper = mount(PageTabs, {
        props: { tabs: mockTabs },
        ...globalStubs,
      });

      expect(wrapper.findAll("[data-testid='tab']")).toHaveLength(3);
    });

    it("renders tab labels in uppercase", () => {
      const wrapper = mount(PageTabs, {
        props: { tabs: mockTabs },
        ...globalStubs,
      });

      const links = wrapper.findAll("[data-testid='nuxt-link']");
      expect(links[0].text()).toBe("PROFILE");
      expect(links[1].text()).toBe("SKILLS");
      expect(links[2].text()).toBe("CVS");
    });

    it("renders NuxtLink with correct href for each tab", () => {
      const wrapper = mount(PageTabs, {
        props: { tabs: mockTabs },
        ...globalStubs,
      });

      const links = wrapper.findAll("[data-testid='nuxt-link']");
      expect(links[0].attributes("href")).toBe("/users/1/profile");
      expect(links[1].attributes("href")).toBe("/users/1/skills");
      expect(links[2].attributes("href")).toBe("/users/1/cvs");
    });

    it("renders slot content inside TabPanel", () => {
      const wrapper = mount(PageTabs, {
        props: { tabs: mockTabs },
        slots: { default: "<p data-testid='slot-content'>Slot content</p>" },
        ...globalStubs,
      });

      expect(wrapper.find("[data-testid='slot-content']").exists()).toBe(true);
    });
  });

  describe("currentTab computed", () => {
    it("returns label of tab matching current route path", () => {
      mockRoute.path = "/users/1/skills";

      const wrapper = mount(PageTabs, {
        props: { tabs: mockTabs },
        ...globalStubs,
      });

      expect(wrapper.find("[data-testid='tabs']").attributes("data-value")).toBe("Skills");
    });

    it("returns first tab label when no tab matches current route", () => {
      mockRoute.path = "/some/unknown/path";

      const wrapper = mount(PageTabs, {
        props: { tabs: mockTabs },
        ...globalStubs,
      });

      expect(wrapper.find("[data-testid='tabs']").attributes("data-value")).toBe("Profile");
    });

    it("returns 'page' when tabs array is empty and no route match", () => {
      mockRoute.path = "/some/unknown/path";

      const wrapper = mount(PageTabs, {
        props: { tabs: [] },
        ...globalStubs,
      });

      expect(wrapper.find("[data-testid='tabs']").attributes("data-value")).toBe("page");
    });

    it("passes currentTab as value to TabPanel", () => {
      mockRoute.path = "/users/1/cvs";

      const wrapper = mount(PageTabs, {
        props: { tabs: mockTabs },
        ...globalStubs,
      });

      expect(wrapper.find("[data-testid='tab-panel']").attributes("data-value")).toBe("CVs");
    });
  });

  describe("centered prop", () => {
    it("applies centered class when centered prop is true", () => {
      const wrapper = mount(PageTabs, {
        props: { tabs: mockTabs, centered: true },
        ...globalStubs,
      });

      expect(wrapper.find("[data-testid='tabs']").classes()).toContain("centered");
    });

    it("does not apply centered class when centered prop is false", () => {
      const wrapper = mount(PageTabs, {
        props: { tabs: mockTabs, centered: false },
        ...globalStubs,
      });

      expect(wrapper.find("[data-testid='tabs']").classes()).not.toContain("centered");
    });

    it("does not apply centered class by default", () => {
      const wrapper = mount(PageTabs, {
        props: { tabs: mockTabs },
        ...globalStubs,
      });

      expect(wrapper.find("[data-testid='tabs']").classes()).not.toContain("centered");
    });
  });
});
