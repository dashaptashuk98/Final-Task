import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SkillForm from "@/components/SkillForm.vue";
import type { InputType } from "~/types/types";

const globalStubs = {
  global: {
    stubs: {
      Form: { template: "<form><slot /></form>" },
      InputText: {
        props: ["modelValue", "disabled", "id"],
        emits: ["update:modelValue"],
        template: `<input :id="id" :value="modelValue" :disabled="disabled" data-testid="input-text" @input="$emit('update:modelValue', $event.target.value)" />`,
      },
      Select: {
        props: ["modelValue", "disabled", "options", "optionLabel", "optionValue"],
        emits: ["update:modelValue"],
        template: `<select :disabled="disabled" data-testid="select" @change="$emit('update:modelValue', $event.target.value)">
          <option v-for="opt in options" :key="opt.name" :value="opt.name">{{ opt.name }}</option>
        </select>`,
      },
      Button: {
        props: ["label", "disabled", "type", "severity"],
        emits: ["click"],
        template: `<button :data-testid="'button-' + label.toLowerCase()" :disabled="disabled" @click="$emit('click')">{{ label }}</button>`,
      },
      Message: {
        props: ["severity"],
        template: `<div data-testid="error-message"><slot /></div>`,
      },
    },
  },
};

const mockData: Record<string, InputType> = {
  firstName: {
    key: "firstName",
    label: "First Name",
    type: "InputText",
    value: "John",
    disabled: false,
  },
  lastName: {
    key: "lastName",
    label: "Last Name",
    type: "InputText",
    value: "Doe",
    disabled: false,
  },
};

const mockDataWithSelect: Record<string, InputType> = {
  language: {
    key: "language",
    label: "Language",
    type: "Select",
    value: "English",
    values: [{ name: "English" }, { name: "German" }],
    disabled: false,
  },
  skill: {
    key: "skill",
    label: "Skill",
    type: "Select",
    value: "Vue",
    values: [{ name: "Vue" }, { name: "React" }],
    disabled: false,
  },
};

describe("SkillForm", () => {
  describe("rendering", () => {
    it("renders InputText fields from data prop", () => {
      const wrapper = mount(SkillForm, {
        props: { data: mockData },
        ...globalStubs,
      });

      expect(wrapper.findAll("[data-testid='input-text']")).toHaveLength(2);
    });

    it("renders Select fields from data prop", () => {
      const wrapper = mount(SkillForm, {
        props: { data: mockDataWithSelect },
        ...globalStubs,
      });

      expect(wrapper.findAll("[data-testid='select']")).toHaveLength(2);
    });

    it("renders labels for each field", () => {
      const wrapper = mount(SkillForm, {
        props: { data: mockData },
        ...globalStubs,
      });

      expect(wrapper.text()).toContain("First Name");
      expect(wrapper.text()).toContain("Last Name");
    });

    it("renders Cancel and Confirm buttons", () => {
      const wrapper = mount(SkillForm, {
        props: { data: mockData },
        ...globalStubs,
      });

      expect(wrapper.find("[data-testid='button-cancel']").exists()).toBe(true);
      expect(wrapper.find("[data-testid='button-confirm']").exists()).toBe(true);
    });

    it("renders nothing when data is null", () => {
      const wrapper = mount(SkillForm, {
        props: { data: null },
        ...globalStubs,
      });

      expect(wrapper.findAll("[data-testid='input-text']")).toHaveLength(0);
      expect(wrapper.findAll("[data-testid='select']")).toHaveLength(0);
    });

    it("renders error message when errorMessage prop is set", () => {
      const wrapper = mount(SkillForm, {
        props: { data: mockData, errorMessage: "Something went wrong" },
        ...globalStubs,
      });

      const error = wrapper.find("[data-testid='error-message']");
      expect(error.exists()).toBe(true);
      expect(error.text()).toContain("Something went wrong");
    });

    it("does not render error message when errorMessage is empty", () => {
      const wrapper = mount(SkillForm, {
        props: { data: mockData, errorMessage: "" },
        ...globalStubs,
      });

      expect(wrapper.find("[data-testid='error-message']").exists()).toBe(false);
    });

    it("applies two-columns class when twoColumns prop is true", () => {
      const wrapper = mount(SkillForm, {
        props: { data: mockData, twoColumns: true },
        ...globalStubs,
      });

      expect(wrapper.find(".form-input-wrapper").classes()).toContain("two-columns");
    });

    it("does not apply two-columns class when twoColumns is false", () => {
      const wrapper = mount(SkillForm, {
        props: { data: mockData, twoColumns: false },
        ...globalStubs,
      });

      expect(wrapper.find(".form-input-wrapper").classes()).not.toContain("two-columns");
    });
  });

  describe("disabled prop", () => {
    it("disables Confirm button when disabled prop is true", () => {
      const wrapper = mount(SkillForm, {
        props: { data: mockData, disabled: true },
        ...globalStubs,
      });

      const confirmButton = wrapper.find("[data-testid='button-confirm']");
      expect(confirmButton.attributes("disabled")).toBeDefined();
    });

    it("enables Confirm button when disabled prop is false", () => {
      const wrapper = mount(SkillForm, {
        props: { data: mockData, disabled: false },
        ...globalStubs,
      });

      const confirmButton = wrapper.find("[data-testid='button-confirm']");
      expect(confirmButton.attributes("disabled")).toBeUndefined();
    });

    it("disables InputText when item.disabled is true", () => {
      const wrapper = mount(SkillForm, {
        props: {
          data: {
            firstName: {
              key: "firstName",
              label: "First Name",
              type: "InputText",
              value: "John",
              disabled: true,
            },
          },
        },
        ...globalStubs,
      });

      const input = wrapper.find("[data-testid='input-text']");
      expect((input.element as HTMLInputElement).disabled).toBe(true);
    });
  });

  describe("Select disabled logic", () => {
    it("disables language Select when action is Update", () => {
      const wrapper = mount(SkillForm, {
        props: { data: mockDataWithSelect, action: "Update" },
        ...globalStubs,
      });

      const selects = wrapper.findAll("[data-testid='select']");
      const languageSelect = selects[0];
      expect((languageSelect.element as HTMLSelectElement).disabled).toBe(true);
    });

    it("disables skill Select when action is Update", () => {
      const wrapper = mount(SkillForm, {
        props: { data: mockDataWithSelect, action: "Update" },
        ...globalStubs,
      });

      const selects = wrapper.findAll("[data-testid='select']");
      const skillSelect = selects[1];
      expect((skillSelect.element as HTMLSelectElement).disabled).toBe(true);
    });

    it("enables language Select when action is Add", () => {
      const wrapper = mount(SkillForm, {
        props: { data: mockDataWithSelect, action: "Add" },
        ...globalStubs,
      });

      const selects = wrapper.findAll("[data-testid='select']");
      const languageSelect = selects[0];
      expect((languageSelect.element as HTMLSelectElement).disabled).toBe(false);
    });
  });

  describe("emits", () => {
    it("emits cancel when Cancel button is clicked", async () => {
      const wrapper = mount(SkillForm, {
        props: { data: mockData },
        ...globalStubs,
      });

      await wrapper.find("[data-testid='button-cancel']").trigger("click");

      expect(wrapper.emitted("cancel")).toBeTruthy();
    });

    it("emits save with data and action when Confirm button is clicked", async () => {
      const wrapper = mount(SkillForm, {
        props: { data: mockData, action: "Add" },
        ...globalStubs,
      });

      await wrapper.find("[data-testid='button-confirm']").trigger("click");

      expect(wrapper.emitted("save")).toBeTruthy();
      expect(wrapper.emitted("save")![0]).toEqual([mockData, "Add"]);
    });

    it("emits save with Update action when action prop is Update", async () => {
      const wrapper = mount(SkillForm, {
        props: { data: mockData, action: "Update" },
        ...globalStubs,
      });

      await wrapper.find("[data-testid='button-confirm']").trigger("click");

      expect(wrapper.emitted("save")![0]).toEqual([mockData, "Update"]);
    });

    it("does not emit save when data is null", async () => {
      const wrapper = mount(SkillForm, {
        props: { data: null },
        ...globalStubs,
      });

      await wrapper.find("[data-testid='button-confirm']").trigger("click");

      expect(wrapper.emitted("save")).toBeFalsy();
    });
  });

  describe("default prop values", () => {
    it("uses Add as default action", async () => {
      const wrapper = mount(SkillForm, {
        props: { data: mockData },
        ...globalStubs,
      });

      await wrapper.find("[data-testid='button-confirm']").trigger("click");

      expect(wrapper.emitted("save")![0][1]).toBe("Add");
    });

    it("confirm button is enabled by default", () => {
      const wrapper = mount(SkillForm, {
        props: { data: mockData },
        ...globalStubs,
      });

      expect(wrapper.find("[data-testid='button-confirm']").attributes("disabled")).toBeUndefined();
    });
  });
});
