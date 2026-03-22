import { shallowMount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { createRouter, createMemoryHistory } from "vue-router";
import HeaderComponent from "@/components/HeaderComponent.vue";

const stubs = {
  Breadcrumb: { template: "<nav class='breadcrumb'><slot /></nav>", props: ["model", "home"] },
};

const createTestRouter = (path: string) => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path, component: { template: "<div />" } }],
  });
  return router;
};

describe("HeaderComponent", () => {
  it("renders breadcrumb", async () => {
    const router = createTestRouter("/users");
    await router.push("/users");
    const wrapper = shallowMount(HeaderComponent, {
      global: { stubs, plugins: [router] },
    });
    expect(wrapper.find(".breadcrumb").exists()).toBe(true);
  });

  it("sets Employee label for /users path", async () => {
    const router = createTestRouter("/users");
    await router.push("/users");
    const wrapper = shallowMount(HeaderComponent, {
      global: { stubs, plugins: [router] },
    });
    const vm = wrapper.vm as unknown as { items: { label: string; route: string }[] };
    expect(vm.items[0]?.label).toBe("Employee");
  });

  it("sets Skills label for /skills path", async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: "/skills", component: { template: "<div />" } }],
    });
    await router.push("/skills");
    const wrapper = shallowMount(HeaderComponent, {
      global: { stubs, plugins: [router] },
    });
    const vm = wrapper.vm as unknown as { items: { label: string }[] };
    expect(vm.items[0]?.label).toBe("Skills");
  });

  it("sets Cvs label for /cvs path", async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: "/cvs", component: { template: "<div />" } }],
    });
    await router.push("/cvs");
    const wrapper = shallowMount(HeaderComponent, {
      global: { stubs, plugins: [router] },
    });
    const vm = wrapper.vm as unknown as { items: { label: string }[] };
    expect(vm.items[0]?.label).toBe("Cvs");
  });

  it("sets empty items for unknown path", async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: "/unknown", component: { template: "<div />" } }],
    });
    await router.push("/unknown");
    const wrapper = shallowMount(HeaderComponent, {
      global: { stubs, plugins: [router] },
    });
    const vm = wrapper.vm as unknown as { items: unknown[] };
    expect(vm.items).toHaveLength(0);
  });
});
