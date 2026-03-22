import { mount, shallowMount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import SkillsComponent from "@/components/SkillsComponent.vue";

const skills = [
  { id: "1", name: "Vue", mastery: "Expert" as const, category_name: "Frontend", categoryId: "1" },
  {
    id: "2",
    name: "React",
    mastery: "Novice" as const,
    category_name: "Frontend",
    categoryId: "1",
  },
  {
    id: "3",
    name: "Node",
    mastery: "Competent" as const,
    category_name: "Backend",
    categoryId: "2",
  },
];

const stubs = {
  ProgressBar: { template: "<div class='progress-bar' />" },
};

describe("SkillsComponent", () => {
  it("renders skills container", () => {
    const wrapper = shallowMount(SkillsComponent, {
      props: { skills },
      global: { stubs },
    });
    expect(wrapper.find(".skills-container").exists()).toBe(true);
  });

  it("groups skills by category", () => {
    const wrapper = shallowMount(SkillsComponent, {
      props: { skills },
      global: { stubs },
    });
    expect(wrapper.findAll(".category-block").length).toBe(2);
  });

  it("renders empty when no skills", () => {
    const wrapper = shallowMount(SkillsComponent, {
      props: { skills: [] },
      global: { stubs },
    });
    expect(wrapper.findAll(".category-block").length).toBe(0);
  });

  it("shows checkboxes in delete mode", () => {
    const wrapper = mount(SkillsComponent, {
      props: { skills, deleteMode: true, selectedSkills: new Set() },
      global: { stubs },
    });
    expect(wrapper.findAll(".checkbox-wrapper").length).toBe(3);
  });

  it("emits toggle-skill on checkbox change", async () => {
    const wrapper = mount(SkillsComponent, {
      props: { skills, deleteMode: true, selectedSkills: new Set() },
      global: { stubs },
    });
    await wrapper.find("input[type='checkbox']").trigger("change");
    expect(wrapper.emitted("toggle-skill")).toBeTruthy();
    expect(wrapper.emitted("toggle-skill")?.[0]).toEqual(["Vue"]);
  });

  it("emits skill-click when not readOnly and not deleteMode", async () => {
    const wrapper = mount(SkillsComponent, {
      props: { skills, deleteMode: false, readOnly: false },
      global: { stubs },
    });
    await wrapper.find(".skill-content").trigger("click");
    expect(wrapper.emitted("skill-click")).toBeTruthy();
  });

  it("does not emit skill-click when readOnly", async () => {
    const wrapper = mount(SkillsComponent, {
      props: { skills, deleteMode: false, readOnly: true },
      global: { stubs },
    });
    await wrapper.find(".skill-content").trigger("click");
    expect(wrapper.emitted("skill-click")).toBeFalsy();
  });

  it("does not emit skill-click when deleteMode", async () => {
    const wrapper = mount(SkillsComponent, {
      props: { skills, deleteMode: true, selectedSkills: new Set() },
      global: { stubs },
    });
    await wrapper.find(".skill-content").trigger("click");
    expect(wrapper.emitted("skill-click")).toBeFalsy();
  });

  it("renders skill names", () => {
    const wrapper = mount(SkillsComponent, {
      props: { skills },
      global: { stubs },
    });
    expect(wrapper.text()).toContain("Vue");
    expect(wrapper.text()).toContain("React");
    expect(wrapper.text()).toContain("Node");
  });
});
