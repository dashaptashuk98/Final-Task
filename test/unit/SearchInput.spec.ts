import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import SearchInput from "@/components/SearchInput";
import PrimeVue from "primevue/config";

const mountOptions = { global: { plugins: [PrimeVue] } };

describe("SearchInput", () => {
  it("clears input and emits empty string on button click", async () => {
    const wrapper = mount(SearchInput, mountOptions);
    const input = wrapper.find("input");
    await input.setValue("test");
    await wrapper.find("button").trigger("click");
    expect((input.element as HTMLInputElement).value).toBe("");
    expect(wrapper.emitted("submitSearch")![0]).toEqual([""]);
  });

  it("emits submitSearch with value on icon click", async () => {
    const wrapper = mount(SearchInput, mountOptions);
    const input = wrapper.find("input");
    await input.setValue("hello");
    await wrapper.find(".pi-search").trigger("click");
    expect(wrapper.emitted("submitSearch")?.[0]).toEqual(["hello"]);
  });

  it("renders search input", () => {
    const wrapper = mount(SearchInput, mountOptions);
    expect(wrapper.find("input").exists()).toBe(true);
  });
});
