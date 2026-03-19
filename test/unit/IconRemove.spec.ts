import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import IconRemove from "@/components/IconRemove.vue";

describe("IconRemove", () => {
  it("renders correctly", () => {
    const wrapper = mount(IconRemove);
    expect(wrapper.exists()).toBe(true);
  });

  it("renders an SVG element", () => {
    const wrapper = mount(IconRemove);
    expect(wrapper.find("svg").exists()).toBe(true);
  });
  it("renders the correct number of paths", () => {
    const wrapper = mount(IconRemove);
    expect(wrapper.findAll("path")).toHaveLength(1);
  });
});
