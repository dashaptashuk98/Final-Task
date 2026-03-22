import { shallowMount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { createRouter, createMemoryHistory } from "vue-router";
import { ref } from "vue";
import SidebarMenu from "@/components/SidebarMenu.vue";

mockNuxtImport("useAuth", () =>
  vi.fn(() => ({
    authUser: ref({
      id: "1",
      email: "test@test.com",
      profile: { avatar: null, full_name: "Test User" },
    }),
    logout: vi.fn(),
  })),
);

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: "/", component: { template: "<div />" } },
    { path: "/users", component: { template: "<div />" } },
  ],
});

const stubs = {
  Panel: { template: "<div><slot /></div>" },
  NuxtLink: { template: "<a><slot /></a>", props: ["to"] },
  Avatar: { template: "<div class='avatar' />" },
  Button: {
    template: "<button @click=\"$emit('click')\"></button>",
    emits: ["click"],
  },
  IconSkills: { template: "<span />" },
};

describe("SidebarMenu", () => {
  it("renders without errors", () => {
    const wrapper = shallowMount(SidebarMenu, {
      global: { stubs, plugins: [router] },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders 7 menu items", () => {
    const wrapper = shallowMount(SidebarMenu, {
      global: { stubs, plugins: [router] },
    });
    expect(wrapper.findAll(".sidebar__item").length).toBe(7);
  });

  it("renders avatar for authenticated user", () => {
    const wrapper = shallowMount(SidebarMenu, {
      global: { stubs, plugins: [router] },
    });
    expect(wrapper.find(".avatar").exists()).toBe(true);
  });

  it("renders logout button", () => {
    const wrapper = shallowMount(SidebarMenu, {
      global: { stubs, plugins: [router] },
    });
    expect(wrapper.find("button").exists()).toBe(true);
  });

  it("renders sidebar__bottom section", () => {
    const wrapper = shallowMount(SidebarMenu, {
      global: { stubs, plugins: [router] },
    });
    expect(wrapper.find(".sidebar__bottom").exists()).toBe(true);
  });
});
