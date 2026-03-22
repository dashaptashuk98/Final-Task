import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import SearchInput from "@/components/SearchInput";
import PrimeVue from "primevue/config";

describe("SearchInput", () => {
  it("clears input and emits empty string", async () => {
    const wrapper = mount(SearchInput, {
      global: {
        plugins: [PrimeVue],
      },
    });
    const input = wrapper.find("input");
    await input.setValue("test");
    const button = wrapper.find("button");
    await button.trigger("click");

    expect((input.element as HTMLInputElement).value).toBe("");
    expect(wrapper.emitted("submitSearch")![0]).toEqual([""]);
  });
});
