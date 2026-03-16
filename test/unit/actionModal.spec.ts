import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import actionModal from "@/components/actionModal.vue";
import Button from "primevue/button";

globalThis.computed = vi.fn((fn) => ({ value: fn() }));
globalThis.defineProps = vi.fn();
globalThis.defineEmits = vi.fn();

vi.mock("primevue/button", () => ({
  default: {
    name: "Button",
    template:
      '<button :class="[severity, $attrs.class]" @click="$emit(\'click\')" v-bind="$attrs">{{ label }}</button>',
    props: ["label", "severity"],
    emits: ["click"],
  },
}));

describe("actionModal", () => {
  describe("Slot mode", () => {
    it("displays slot when itemName is not provided", () => {
      const wrapper = mount(actionModal, {
        slots: { default: "<div>content</div>" },
        global: {
          components: {
            Button,
          },
        },
      });

      expect(wrapper.find(".delete-confirmation").exists()).toBe(false);
      expect(wrapper.text()).toBe("content");
    });
  });

  describe("Confirmation mode", () => {
    let wrapper;

    beforeEach(() => {
      wrapper = mount(actionModal, {
        props: { itemName: "Test Item" },
        global: {
          components: {
            Button,
          },
        },
      });
    });

    it("displays confirmation UI", () => {
      expect(wrapper.find(".delete-confirmation").exists()).toBe(true);
      expect(wrapper.find("strong").text()).toBe("Test Item");
    });

    it("shows cancel and confirm buttons", () => {
      const buttons = wrapper.findAll("button");
      expect(buttons).toHaveLength(2);
      expect(buttons[0].text()).toBe("CANCEL");
      expect(buttons[1].text()).toBe("CONFIRM");
    });

    it("emits events when buttons are clicked", async () => {
      const buttons = wrapper.findAll("button");

      await buttons[0].trigger("click");
      expect(wrapper.emitted("cancel")).toBeTruthy();

      await buttons[1].trigger("click");
      expect(wrapper.emitted("confirm")).toBeTruthy();
    });
  });

  describe("Custom texts", () => {
    it("uses provided props with default text and itemType", () => {
      const wrapper = mount(actionModal, {
        props: {
          itemName: "Test",
          cancelText: "No",
          confirmText: "Yes",
          itemType: "file",
        },
        global: {
          components: {
            Button,
          },
        },
      });
      expect(wrapper.find(".delete-question").text()).toContain("file");
      expect(wrapper.find(".delete-question").text()).toContain("Test");

      const buttons = wrapper.findAll("button");
      expect(buttons[0].text()).toBe("No");
      expect(buttons[1].text()).toBe("Yes");
    });

    it("uses custom questionText", () => {
      const wrapper = mount(actionModal, {
        props: {
          itemName: "Test",
          questionText: "Delete this?",
          cancelText: "No",
          confirmText: "Yes",
        },
        global: {
          components: {
            Button,
          },
        },
      });

      expect(wrapper.find(".delete-question").text()).toContain("Delete this?");
      expect(wrapper.find(".delete-question").text()).toContain("Test");

      const buttons = wrapper.findAll("button");
      expect(buttons[0].text()).toBe("No");
      expect(buttons[1].text()).toBe("Yes");
    });
  });
});
