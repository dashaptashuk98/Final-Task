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

  it("рендерится только при наличии прав", () => {
    checkRightsMock.mockReturnValueOnce(false);
    const wrapper = mount(AddRemoveButtons, { props: defaultProps });
    expect(wrapper.find(".user-action-buttons").exists()).toBe(false);
  });

  describe("режим просмотра (isSelectMode = false)", () => {
    it("отображает кнопки Add и Remove", () => {
      const wrapper = mount(AddRemoveButtons, { props: defaultProps });
      const buttons = wrapper.findAllComponents({ name: "Button" });

      expect(buttons).toHaveLength(2);
      expect(buttons[0].props("label")).toBe("ADD SKILL");
      expect(buttons[0].props("icon")).toBe("pi pi-plus");
      expect(buttons[0].classes()).toContain("btn-add");

      expect(buttons[1].props("label")).toBe("REMOVE SKILLS");
      expect(buttons[1].classes()).toContain("btn-remove");
    });

    it("показывает иконку IconRemove на второй кнопке", () => {
      const wrapper = mount(AddRemoveButtons, { props: defaultProps });
      expect(wrapper.findComponent(IconRemove).exists()).toBe(true);
    });

    it("не показывает badge на второй кнопке", () => {
      const wrapper = mount(AddRemoveButtons, { props: defaultProps });
      expect(wrapper.findAllComponents({ name: "Button" })[1].props("badge")).toBe("");
    });

    it("эмитит activateModal при клике на Add", async () => {
      const wrapper = mount(AddRemoveButtons, { props: defaultProps });
      await wrapper.findAllComponents({ name: "Button" })[0].trigger("click");
      expect(wrapper.emitted("activateModal")?.[0]).toEqual(["Add"]);
    });

    it("эмитит toggleMode при клике на Remove", async () => {
      const wrapper = mount(AddRemoveButtons, { props: defaultProps });
      await wrapper.findAllComponents({ name: "Button" })[1].trigger("click");
      expect(wrapper.emitted("toggleMode")).toBeTruthy();
    });
  });

  describe("режим выбора (isSelectMode = true)", () => {
    const selectProps = { ...defaultProps, isSelectMode: true, selectCounter: 3 };

    it("отображает кнопки Cancel и Delete", () => {
      const wrapper = mount(AddRemoveButtons, { props: selectProps });
      const buttons = wrapper.findAllComponents({ name: "Button" });

      expect(buttons[0].props("label")).toBe("CANCEL");
      expect(buttons[0].classes()).toContain("btn-cancel");

      expect(buttons[1].props("label")).toBe("DELETE");
      expect(buttons[1].classes()).toContain("btn-delete");
    });

    it("не показывает IconRemove", () => {
      const wrapper = mount(AddRemoveButtons, { props: selectProps });
      expect(wrapper.findComponent(IconRemove).exists()).toBe(false);
    });

    it("показывает badge с количеством выбранных элементов", () => {
      const wrapper = mount(AddRemoveButtons, { props: selectProps });
      const deleteButton = wrapper.findAllComponents({ name: "Button" })[1];
      expect(deleteButton.props("badge")).toBe("3");
    });

    it("эмитит toggleMode при клике на Cancel", async () => {
      const wrapper = mount(AddRemoveButtons, { props: selectProps });
      await wrapper.findAllComponents({ name: "Button" })[0].trigger("click");
      expect(wrapper.emitted("toggleMode")).toBeTruthy();
    });

    it("эмитит handleRemove при клике на Delete", async () => {
      const wrapper = mount(AddRemoveButtons, { props: selectProps });
      await wrapper.findAllComponents({ name: "Button" })[1].trigger("click");
      expect(wrapper.emitted("handleRemove")).toBeTruthy();
    });
  });

  it("обновляет label при изменении pageTitle", () => {
    const wrapper = mount(AddRemoveButtons, {
      props: { ...defaultProps, pageTitle: "language" },
    });
    expect(wrapper.findAllComponents({ name: "Button" })[0].props("label")).toBe("ADD LANGUAGE");
  });
});
