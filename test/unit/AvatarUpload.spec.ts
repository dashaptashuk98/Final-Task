import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AvatarUpload from "@/components/AvatarUpload.vue";
import PrimeVue from "primevue/config";

vi.mock("@/graphQL/user/userUpload.mutation", () => ({
  uploadAvatarMutation: "uploadAvatarMutation",
}));

const defaultProps = {
  user: { id: "1", email: "test@test.com", profile: { avatar: null } },
  disabled: false,
};

const mountOptions = { global: { plugins: [PrimeVue] } };

describe("AvatarUpload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders avatar ", () => {
    const wrapper = mount(AvatarUpload, { ...mountOptions, props: defaultProps });
    expect(wrapper.find(".avatar-upload").exists()).toBe(true);
  });

  it("shows error message when error is set", async () => {
    const wrapper = mount(AvatarUpload, { ...mountOptions, props: defaultProps });
    await wrapper.vm.$nextTick();
    const vm = wrapper.vm;
    (vm as unknown as { error: string | null }).error = "File size must not exceed 500 KB";
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".error-message").text()).toBe("File size must not exceed 500 KB");
  });

  it("shows uploading indicator when uploading", async () => {
    const wrapper = mount(AvatarUpload, { ...mountOptions, props: defaultProps });
    const vm = wrapper.vm;
    (vm as unknown as { uploading: boolean }).uploading = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".uploading").exists()).toBe(true);
  });
});
