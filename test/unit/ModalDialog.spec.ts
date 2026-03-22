import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import ModalDialog from "@/components/ModalDialog";
import PrimeVue from "primevue/config";

const defaultProps = {
  visible: false,
  header: "Create user",
  width: "900px",
};

describe("ModalDialog", () => {
  it("modal appears if visible is true", () => {
    defaultProps.visible = true;
    const wrapper = mount(ModalDialog, {
      global: {
        plugins: [PrimeVue],
      },
      props: defaultProps,
    });
    expect(wrapper.exists()).toBeTruthy();
  });
});
