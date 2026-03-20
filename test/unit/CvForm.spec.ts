import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import CvForm from "@/components/CvForm.vue";
import PrimeVue from "primevue/config";

const { checkRightsMock } = vi.hoisted(() => ({ checkRightsMock: vi.fn(() => true) }));
mockNuxtImport("checkRights", () => checkRightsMock);

const mountOptions = { global: { plugins: [PrimeVue] } };

const defaultProps = {
  data: { name: "My CV", education: "MIT", description: "Senior Dev" },
  userId: "1",
  cvId: "cv-1",
};

describe("CvForm", () => {
  it("renders all input fields", () => {
    const wrapper = mount(CvForm, { ...mountOptions, props: defaultProps });
    expect(wrapper.findAll(".form-input-container")).toHaveLength(3);
  });

  it("populates form with provided data", async () => {
    const wrapper = mount(CvForm, { ...mountOptions, props: defaultProps });
    await wrapper.vm.$nextTick();
    expect(
      (
        wrapper.vm as unknown as {
          formData: { name: string; education: string; description: string };
        }
      ).formData.name,
    ).toBe("My CV");
    expect(
      (
        wrapper.vm as unknown as {
          formData: { name: string; education: string; description: string };
        }
      ).formData.education,
    ).toBe("MIT");
    expect(
      (
        wrapper.vm as unknown as {
          formData: { name: string; education: string; description: string };
        }
      ).formData.description,
    ).toBe("Senior Dev");
  });

  it("shows UPDATE button when checkRights returns true", () => {
    checkRightsMock.mockReturnValue(true);
    const wrapper = mount(CvForm, { ...mountOptions, props: defaultProps });
    expect(wrapper.find("button").exists()).toBe(true);
  });

  it("hides UPDATE button when checkRights returns false", () => {
    checkRightsMock.mockReturnValue(false);
    const wrapper = mount(CvForm, { ...mountOptions, props: defaultProps });
    expect(wrapper.find("button").exists()).toBe(false);
    checkRightsMock.mockReturnValue(true);
  });

  it("emits submitCv with cvId when cvId is provided", async () => {
    checkRightsMock.mockReturnValue(true);
    const wrapper = mount(CvForm, { ...mountOptions, props: defaultProps });
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("submitCv")?.[0]).toEqual([
      "cv-1",
      { name: "My CV", education: "MIT", description: "Senior Dev" },
    ]);
  });

  it("emits submitCv with userId when cvId is empty", async () => {
    checkRightsMock.mockReturnValue(true);
    const wrapper = mount(CvForm, {
      ...mountOptions,
      props: { ...defaultProps, cvId: "" },
    });
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("submitCv")?.[0]).toEqual([
      "1",
      { name: "My CV", education: "MIT", description: "Senior Dev" },
    ]);
  });

  it("initializes with empty form when data is null", async () => {
    const wrapper = mount(CvForm, {
      ...mountOptions,
      props: { ...defaultProps, data: null },
    });
    await wrapper.vm.$nextTick();
    expect((wrapper.vm as unknown as { formData: { name: string } }).formData.name).toBe("");
  });
});
