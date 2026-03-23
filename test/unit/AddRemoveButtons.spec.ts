import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import AddRemoveButtons from "@/components/AddRemoveButtons.vue";
import IconRemove from "@/components/IconRemove.vue";

const { checkRightsMock } = vi.hoisted(() => ({ checkRightsMock: vi.fn() }));

mockNuxtImport("checkRights", () => checkRightsMock);
mockNuxtImport("useRoute", () => () => ({ params: { userID: "123" } }));

const defaultProps = {
  isSelectMode: false,
  selectCounter: 0,
  pageTitle: "skill",
};

describe("AddRemoveButtons", () => {
  beforeEach(() => {
    checkRightsMock.mockReturnValue(true);
  });

  it("does not render without rights", () => {
    checkRightsMock.mockReturnValueOnce(false);
    const wrapper = mount(AddRemoveButtons, { props: defaultProps });
    expect(wrapper.find(".user-action-buttons").exists()).toBe(false);
  });

  describe("view mode (isSelectMode = false)", () => {
    it("renders Add and Remove buttons", () => {
      const wrapper = mount(AddRemoveButtons, { props: defaultProps });
      const buttons = wrapper.findAllComponents({ name: "Button" });

      expect(buttons).toHaveLength(2);
      expect(buttons[0].props("label")).toBe("ADD SKILL");
      expect(buttons[0].props("icon")).toBe("pi pi-plus");
      expect(buttons[0].classes()).toContain("btn-add");

      expect(buttons[1].props("label")).toBe("REMOVE SKILLS");
      expect(buttons[1].classes()).toContain("btn-remove");
    });

    it("shows IconRemove icon on second button", () => {
      const wrapper = mount(AddRemoveButtons, { props: defaultProps });
      expect(wrapper.findComponent(IconRemove).exists()).toBe(true);
    });

    it("does not show badge on second button", () => {
      const wrapper = mount(AddRemoveButtons, { props: defaultProps });
      expect(wrapper.findAllComponents({ name: "Button" })[1].props("badge")).toBe("");
    });

    it("emits activateModal on Add click", async () => {
      const wrapper = mount(AddRemoveButtons, { props: defaultProps });
      await wrapper.findAllComponents({ name: "Button" })[0].trigger("click");
      expect(wrapper.emitted("activateModal")?.[0]).toEqual(["Add"]);
    });

    it("emits toggleMode on Remove click", async () => {
      const wrapper = mount(AddRemoveButtons, { props: defaultProps });
      await wrapper.findAllComponents({ name: "Button" })[1].trigger("click");
      expect(wrapper.emitted("toggleMode")).toBeTruthy();
    });
  });

  describe("select mode (isSelectMode = true)", () => {
    const selectProps = { ...defaultProps, isSelectMode: true, selectCounter: 3 };

    it("renders Cancel and Delete buttons", () => {
      const wrapper = mount(AddRemoveButtons, { props: selectProps });
      const buttons = wrapper.findAllComponents({ name: "Button" });

      expect(buttons[0].props("label")).toBe("CANCEL");
      expect(buttons[0].classes()).toContain("btn-cancel");

      expect(buttons[1].props("label")).toBe("DELETE");
      expect(buttons[1].classes()).toContain("btn-delete");
    });

    it("does not show IconRemove", () => {
      const wrapper = mount(AddRemoveButtons, { props: selectProps });
      expect(wrapper.findComponent(IconRemove).exists()).toBe(false);
    });

    it("shows badge with selected items count", () => {
      const wrapper = mount(AddRemoveButtons, { props: selectProps });
      const deleteButton = wrapper.findAllComponents({ name: "Button" })[1];
      expect(deleteButton.props("badge")).toBe("3");
    });

    it("emits toggleMode on Cancel click", async () => {
      const wrapper = mount(AddRemoveButtons, { props: selectProps });
      await wrapper.findAllComponents({ name: "Button" })[0].trigger("click");
      expect(wrapper.emitted("toggleMode")).toBeTruthy();
    });

    it("emits handleRemove on Delete click", async () => {
      const wrapper = mount(AddRemoveButtons, { props: selectProps });
      await wrapper.findAllComponents({ name: "Button" })[1].trigger("click");
      expect(wrapper.emitted("handleRemove")).toBeTruthy();
    });
  });

  it("updates label when pageTitle changes", () => {
    const wrapper = mount(AddRemoveButtons, {
      props: { ...defaultProps, pageTitle: "language" },
    });
    expect(wrapper.findAllComponents({ name: "Button" })[0].props("label")).toBe("ADD LANGUAGE");
  });
});
