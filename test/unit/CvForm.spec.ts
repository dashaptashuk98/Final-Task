import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import CvForm from "@/components/CvForm.vue";
import PrimeVue from "primevue/config";

const { checkRightsMock } = vi.hoisted(() => ({ checkRightsMock: vi.fn(() => true) }));
mockNuxtImport("checkRights", () => checkRightsMock);
const FormStub = {
  name: "Form",
  template: '<div class="form-stub"><slot /></div>',
};

const InputTextStub = {
  name: "InputText",
  template:
    '<input class="p-inputtext" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
  props: ["modelValue", "id", "placeholder"],
  emits: ["update:modelValue"],
};

const TextareaStub = {
  name: "Textarea",
  template:
    '<textarea class="p-textarea" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
  props: ["modelValue", "id", "placeholder"],
  emits: ["update:modelValue"],
};

const ButtonStub = {
  name: "Button",
  template: '<button :disabled="disabled" @click="handleClick">{{ label }}<slot /></button>',
  props: ["disabled", "label"],
  emits: ["click"],
  methods: {
    handleClick(event: Event) {
      this.$emit("click", event);
    },
  },
};

const mountOptions = {
  global: {
    plugins: [PrimeVue],
    stubs: {
      Form: FormStub,
      InputText: InputTextStub,
      Textarea: TextareaStub,
      Button: ButtonStub,
    },
  },
};

const defaultProps = {
  data: { name: "My CV", education: "MIT", description: "Senior Dev" },
  userId: "1",
  cvId: "cv-1",
};

describe("CvForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all input fields", () => {
    const wrapper = mount(CvForm, { ...mountOptions, props: defaultProps });
    expect(wrapper.findAll(".form-input-container")).toHaveLength(3);
  });

  it("populates form with provided data", async () => {
    const wrapper = mount(CvForm, { ...mountOptions, props: defaultProps });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.formData.name).toBe("My CV");
    expect(wrapper.vm.formData.education).toBe("MIT");
    expect(wrapper.vm.formData.description).toBe("Senior Dev");
  });

  it("shows UPDATE button when checkRights returns true", async () => {
    checkRightsMock.mockReturnValue(true);
    const wrapper = mount(CvForm, { ...mountOptions, props: defaultProps });
    await wrapper.vm.$nextTick();
    const button = wrapper.find("button");
    expect(button.exists()).toBe(true);
  });

  it("hides UPDATE button when checkRights returns false", async () => {
    checkRightsMock.mockReturnValue(false);
    const wrapper = mount(CvForm, { ...mountOptions, props: defaultProps });
    await wrapper.vm.$nextTick();
    const button = wrapper.find("button");
    expect(button.exists()).toBe(false);
  });

  it("emits submitCv with cvId when cvId is provided", async () => {
    checkRightsMock.mockReturnValue(true);
    const wrapper = mount(CvForm, { ...mountOptions, props: defaultProps });
    await wrapper.vm.$nextTick();
    const formData = wrapper.vm.formData;
    const cvId = defaultProps.cvId;
    await wrapper.vm.$emit("submitCv", cvId, formData);

    expect(wrapper.emitted("submitCv")).toBeTruthy();
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
    await wrapper.vm.$nextTick();
    const formData = wrapper.vm.formData;
    const userId = defaultProps.userId;
    await wrapper.vm.$emit("submitCv", userId, formData);

    expect(wrapper.emitted("submitCv")).toBeTruthy();
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
    expect(wrapper.vm.formData.name).toBe("");
    expect(wrapper.vm.formData.education).toBe("");
    expect(wrapper.vm.formData.description).toBe("");
  });

  it("button is disabled when form data hasn't changed", async () => {
    checkRightsMock.mockReturnValue(true);
    const wrapper = mount(CvForm, { ...mountOptions, props: defaultProps });
    await wrapper.vm.$nextTick();

    const button = wrapper.find("button");
    expect(button.attributes("disabled")).toBeDefined();
  });

  it("button is enabled when form data changes", async () => {
    checkRightsMock.mockReturnValue(true);
    const wrapper = mount(CvForm, { ...mountOptions, props: defaultProps });
    await wrapper.vm.$nextTick();
    wrapper.vm.formData.name = "Updated CV";
    await wrapper.vm.$nextTick();

    const button = wrapper.find("button");
    expect(button.attributes("disabled")).toBeUndefined();
  });

  it("emits submitCv when button is clicked", async () => {
    checkRightsMock.mockReturnValue(true);
    const wrapper = mount(CvForm, { ...mountOptions, props: defaultProps });
    await wrapper.vm.$nextTick();
    wrapper.vm.formData.name = "Updated CV";
    await wrapper.vm.$nextTick();

    const button = wrapper.find("button");
    expect(button.attributes("disabled")).toBeUndefined();
    await button.trigger("click");

    expect(wrapper.emitted("submitCv")).toBeTruthy();
    expect(wrapper.emitted("submitCv")?.[0]).toEqual([
      "cv-1",
      { name: "Updated CV", education: "MIT", description: "Senior Dev" },
    ]);
  });
});
