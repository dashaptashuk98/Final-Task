import { describe, it, expect, vi, beforeEach } from "vitest";
import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import LanguagesContainer from "@/components/LanguagesContainer.vue";
import type { LanguageProficiency } from "~/types/languages";

const { mockCheckRights, mockRoute } = vi.hoisted(() => ({
  mockCheckRights: vi.fn(() => true),
  mockRoute: { params: { userID: "123" } },
}));

mockNuxtImport("useRoute", () => () => mockRoute);
mockNuxtImport("checkRights", () => mockCheckRights);

const CheckboxStub = {
  name: "Checkbox",
  props: ["modelValue", "binary"],
  emits: ["update:modelValue"],
  template: `<input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" data-testid="checkbox" />`,
};

const mountOptions = {
  global: {
    stubs: { Checkbox: CheckboxStub },
  },
};

const mockData: LanguageProficiency[] = [
  { name: "English", proficiency: "C1" },
  { name: "German", proficiency: "B2" },
  { name: "French", proficiency: "Native" },
];

describe("LanguagesContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCheckRights.mockReturnValue(true);
  });

  describe("select mode", () => {
    it("shows checkboxes when isSelectMode is true", async () => {
      const wrapper = await mountSuspended(LanguagesContainer, {
        props: { data: mockData, isSelectMode: true },
        ...mountOptions,
      });

      expect(wrapper.findAll("[data-testid='checkbox']")).toHaveLength(3);
    });

    it("hides checkboxes when isSelectMode is false", async () => {
      const wrapper = await mountSuspended(LanguagesContainer, {
        props: { data: mockData, isSelectMode: false },
        ...mountOptions,
      });

      expect(wrapper.findAll("[data-testid='checkbox']")).toHaveLength(0);
    });

    it("emits updateCounter with correct count when checkboxes are toggled", async () => {
      const wrapper = await mountSuspended(LanguagesContainer, {
        props: { data: mockData, isSelectMode: true },
        ...mountOptions,
      });

      const checkboxes = wrapper.findAll("[data-testid='checkbox']");
      await checkboxes[0].setValue(true);
      await checkboxes[1].setValue(true);

      const emitted = wrapper.emitted("updateCounter");
      expect(emitted).toBeTruthy();
      expect(emitted![emitted!.length - 1][0]).toBe(2);
    });

    it("emits updateItems with current pageItems when checkbox is toggled", async () => {
      const wrapper = await mountSuspended(LanguagesContainer, {
        props: { data: mockData, isSelectMode: true },
        ...mountOptions,
      });

      const checkboxes = wrapper.findAll("[data-testid='checkbox']");
      await checkboxes[0].setValue(true);

      const emitted = wrapper.emitted("updateItems");
      expect(emitted).toBeTruthy();
      const lastEmittedItems = emitted![emitted!.length - 1][0] as {
        name: string;
        isChecked: boolean;
      }[];
      expect(lastEmittedItems[0].isChecked).toBe(true);
      expect(lastEmittedItems[1].isChecked).toBe(false);
    });
  });

  describe("activateUpdateModal", () => {
    it("emits activateModal with correct payload on item click", async () => {
      const wrapper = await mountSuspended(LanguagesContainer, {
        props: { data: mockData, isSelectMode: false },
        ...mountOptions,
      });

      await wrapper.findAll(".language")[0].trigger("click");

      expect(wrapper.emitted("activateModal")).toBeTruthy();
      expect(wrapper.emitted("activateModal")![0]).toEqual([
        "Update",
        { key: "English", value: "C1" },
      ]);
    });

    it("does not emit activateModal when isSelectMode is true", async () => {
      const wrapper = await mountSuspended(LanguagesContainer, {
        props: { data: mockData, isSelectMode: true },
        ...mountOptions,
      });

      await wrapper.findAll(".language")[0].trigger("click");

      expect(wrapper.emitted("activateModal")).toBeFalsy();
    });

    it("does not emit activateModal when checkRights returns false", async () => {
      mockCheckRights.mockReturnValue(false);

      const wrapper = await mountSuspended(LanguagesContainer, {
        props: { data: mockData, isSelectMode: false },
        ...mountOptions,
      });

      await wrapper.findAll(".language")[0].trigger("click");

      expect(wrapper.emitted("activateModal")).toBeFalsy();
    });

    it("calls checkRights with correct userID", async () => {
      const wrapper = await mountSuspended(LanguagesContainer, {
        props: { data: mockData, isSelectMode: false },
        ...mountOptions,
      });

      await wrapper.findAll(".language")[0].trigger("click");

      expect(mockCheckRights).toHaveBeenCalledWith("123");
    });
  });

  describe("data watcher", () => {
    it("resets pageItems when data prop changes", async () => {
      const wrapper = await mountSuspended(LanguagesContainer, {
        props: { data: mockData, isSelectMode: true },
        ...mountOptions,
      });

      await wrapper.setProps({ data: [{ name: "Spanish", proficiency: "A2" }] });

      expect(wrapper.findAll(".language")).toHaveLength(1);
      expect(wrapper.text()).toContain("Spanish");
      expect(wrapper.text()).not.toContain("English");
    });

    it("resets checked state when data prop changes", async () => {
      const wrapper = await mountSuspended(LanguagesContainer, {
        props: { data: mockData, isSelectMode: true },
        ...mountOptions,
      });

      await wrapper.findAll("[data-testid='checkbox']")[0].setValue(true);
      await wrapper.setProps({
        data: [
          { name: "English", proficiency: "C1" },
          { name: "Spanish", proficiency: "A2" },
        ],
      });

      const checkboxes = wrapper.findAll("[data-testid='checkbox']");
      expect((checkboxes[0].element as HTMLInputElement).checked).toBe(false);
    });
  });
});
