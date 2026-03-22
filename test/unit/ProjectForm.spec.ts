import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import PrimeVue from "primevue/config";
import ProjectForm from "@/components/ProjectForm.vue";

const { checkRightsMock } = vi.hoisted(() => ({ checkRightsMock: vi.fn(() => true) }));
mockNuxtImport("checkRights", () => checkRightsMock);

const mountOptions = { global: { plugins: [PrimeVue] } };

const formData = {
  name: { key: "project", label: "Project", value: "Test", type: "Select", values: ["Test"] },
  domain: { key: "domain", label: "Domain", value: "IT", type: "InputText", values: [] },
  start: {
    key: "start date",
    label: "Start date",
    value: "2024-01-01",
    type: "DatePicker",
    values: [],
  },
  end: { key: "end date", label: "End date", value: "2024-12-31", type: "DatePicker", values: [] },
  description: {
    key: "description",
    label: "Description",
    value: "desc",
    type: "Textarea",
    values: [],
  },
  environment: {
    key: "environment",
    label: "Environment",
    value: [],
    type: "MultiSelect",
    values: [],
  },
  responsibilities: {
    key: "responsibilities",
    label: "Responsibilities",
    value: "",
    type: "InputText",
    values: [],
  },
};

describe("ProjectForm", () => {
  it("renders form container", () => {
    const wrapper = mount(ProjectForm, { ...mountOptions, props: { data: formData as never } });
    expect(wrapper.find(".form").exists()).toBe(true);
  });

  it("renders null data without error", () => {
    const wrapper = mount(ProjectForm, { ...mountOptions, props: { data: null } });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders form-input-wrapper", () => {
    const wrapper = mount(ProjectForm, { ...mountOptions, props: { data: formData as never } });
    expect(wrapper.find(".form-input-wrapper").exists()).toBe(true);
  });

  it("renders InputText fields", () => {
    const wrapper = mount(ProjectForm, { ...mountOptions, props: { data: formData as never } });
    expect(wrapper.findAll(".custom-input").length).toBeGreaterThan(0);
  });

  it("renders Select field", () => {
    const wrapper = mount(ProjectForm, { ...mountOptions, props: { data: formData as never } });
    expect(wrapper.find(".custom-select").exists()).toBe(true);
  });

  it("renders DatePicker fields", () => {
    const wrapper = mount(ProjectForm, { ...mountOptions, props: { data: formData as never } });
    expect(wrapper.findAll(".custom-datepicker").length).toBe(2);
  });

  it("renders Textarea field", () => {
    const wrapper = mount(ProjectForm, { ...mountOptions, props: { data: formData as never } });
    expect(wrapper.find(".custom-textarea").exists()).toBe(true);
  });

  it("renders MultiSelect field", () => {
    const wrapper = mount(ProjectForm, { ...mountOptions, props: { data: formData as never } });
    expect(wrapper.find(".custom-multiselect").exists()).toBe(true);
  });

  it("renders full-width for description, environment, responsibilities", () => {
    const wrapper = mount(ProjectForm, { ...mountOptions, props: { data: formData as never } });
    expect(wrapper.findAll(".form-input-container.full-width").length).toBe(3);
  });

  it("applies two-columns class when twoColumns is true", () => {
    const wrapper = mount(ProjectForm, {
      ...mountOptions,
      props: { data: formData as never, twoColumns: true },
    });
    expect(wrapper.find(".form-input-wrapper").classes()).toContain("two-columns");
  });

  it("does not apply two-columns class by default", () => {
    const wrapper = mount(ProjectForm, { ...mountOptions, props: { data: formData as never } });
    expect(wrapper.find(".form-input-wrapper").classes()).not.toContain("two-columns");
  });

  it("emits cancel on cancel button click", async () => {
    const wrapper = mount(ProjectForm, {
      ...mountOptions,
      props: { data: formData as never, userId: "1" },
    });
    const cancelBtn = wrapper.findAll("button").find((b) => b.text() === "Cancel");
    await cancelBtn?.trigger("click");
    expect(wrapper.emitted("cancel")).toBeTruthy();
  });

  it("emits save with data on save button click", async () => {
    const wrapper = mount(ProjectForm, {
      ...mountOptions,
      props: { data: formData as never, action: "Add", userId: "1" },
    });
    const saveBtn = wrapper.findAll("button").find((b) => b.text() === "Add");
    await saveBtn?.trigger("click");
    expect(wrapper.emitted("save")).toBeTruthy();
    expect(wrapper.emitted("save")?.[0][0] as Record<string, unknown>).toHaveProperty("name");
  });

  it("does not emit save when data is null", async () => {
    const wrapper = mount(ProjectForm, { ...mountOptions, props: { data: null, action: "Add" } });
    const saveBtn = wrapper.findAll("button").find((b) => b.text() === "Add");
    await saveBtn?.trigger("click");
    expect(wrapper.emitted("save")).toBeFalsy();
  });

  it("renders custom action label", () => {
    const wrapper = mount(ProjectForm, {
      ...mountOptions,
      props: { data: formData as never, action: "Update" },
    });
    expect(
      wrapper
        .findAll("button")
        .find((b) => b.text() === "Update")
        ?.exists(),
    ).toBe(true);
  });

  it("renders labels for all fields", () => {
    const wrapper = mount(ProjectForm, { ...mountOptions, props: { data: formData as never } });
    expect(wrapper.findAll(".form-input-container__label").length).toBe(7);
  });

  it("checkRights called with userId for Select disabled prop", () => {
    checkRightsMock.mockReturnValue(false);
    const wrapper = mount(ProjectForm, {
      ...mountOptions,
      props: { data: formData as never, userId: "1" },
    });
    expect(checkRightsMock).toHaveBeenCalledWith("1");
    expect(wrapper.find(".custom-select").exists()).toBe(true);
  });

  it("checkRights called without args for DatePicker disabled prop", () => {
    checkRightsMock.mockReturnValue(true);
    mount(ProjectForm, { ...mountOptions, props: { data: formData as never } });
    expect(checkRightsMock).toHaveBeenCalled();
  });
});
