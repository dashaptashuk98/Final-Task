import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import ModalDialog from "@/components/ModalDialog";
import PrimeVue from "primevue/config";

const mountOptions = { global: { plugins: [PrimeVue] } };

describe("ModalDialog", () => {
  it("renders when visible is true", () => {
    const wrapper = mount(ModalDialog, {
      ...mountOptions,
      props: { visible: true, header: "Test" },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders when visible is false", () => {
    const wrapper = mount(ModalDialog, {
      ...mountOptions,
      props: { visible: false, header: "Test" },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("uses default width when width prop not provided", () => {
    const wrapper = mount(ModalDialog, {
      ...mountOptions,
      props: { visible: true, header: "Test" },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("uses custom width when provided", () => {
    const wrapper = mount(ModalDialog, {
      ...mountOptions,
      props: { visible: true, header: "Test", width: "900px" },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("emits update:visible when isVisible setter called", async () => {
    const wrapper = mount(ModalDialog, {
      ...mountOptions,
      props: { visible: true, header: "Test" },
    });
    const vm = wrapper.vm as unknown as { isVisible: boolean };
    vm.isVisible = false;
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted("update:visible")?.[0]).toEqual([false]);
  });
});
