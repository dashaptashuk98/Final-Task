import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import IconSkills from "@/components/IconSkills.vue";

describe("IconRemove", () => {
  it("renders correctly", () => {
    const wrapper = mount(IconSkills);
    expect(wrapper.exists()).toBe(true);
  });

  it("renders an SVG element", () => {
    const wrapper = mount(IconSkills);
    expect(wrapper.find("svg").exists()).toBe(true);
  });
  it("renders the correct number of paths", () => {
    const wrapper = mount(IconSkills);
    expect(wrapper.findAll("path")).toHaveLength(1);
  });
  it("accepts custom size prop", () => {
    const wrapper = mount(IconSkills, {
      props: {
        size: 32,
      },
    });

    const svg = wrapper.find("svg");
    expect(svg.attributes("width")).toBe("32");
    expect(svg.attributes("height")).toBe("12");
  });
});
