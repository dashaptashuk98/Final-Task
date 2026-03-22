import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import AvatarUpload from "@/components/AvatarUpload.vue";

const { mockMutate } = vi.hoisted(() => ({
  mockMutate: vi.fn(),
}));

vi.mock("#app", () => ({
  useNuxtApp: () => ({
    _route: { sync: vi.fn(), path: "/" },
    callHook: vi.fn(),
    $apollo: {
      clients: {
        default: { mutate: mockMutate },
      },
    },
  }),
  useRouter: () => ({
    afterEach: vi.fn(),
    push: vi.fn(),
    replace: vi.fn(),
    currentRoute: { value: { path: "/" } },
  }),
  useRoute: () => ({ path: "/" }),
  navigateTo: vi.fn(),
}));

vi.mock("~/graphQL/user/userUpload.mutation", () => ({
  uploadAvatarMutation: "uploadAvatar",
}));

const mockUser = {
  id: "user-123",
  email: "test@example.com",
  profile: { avatar: null },
};

const globalStubs = {
  global: {
    stubs: {
      Avatar: {
        props: ["image", "label", "shape"],
        emits: ["click"],
        template: `<div data-testid="avatar" :data-image="image" :data-label="label" @click="$emit('click')" />`,
      },
    },
  },
};

const createFile = (name = "photo.png", size = 1024, type = "image/png") => {
  const file = new File(["content"], name, { type });
  Object.defineProperty(file, "size", { value: size });
  return file;
};

describe("AvatarUpload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders avatar with email initial when no avatar image", () => {
      const wrapper = mount(AvatarUpload, {
        props: { user: mockUser },
        ...globalStubs,
      });

      const avatar = wrapper.find("[data-testid='avatar']");
      expect(avatar.attributes("data-label")).toBe("t");
      expect(avatar.attributes("data-image")).toBeUndefined();
    });

    it("renders avatar with image when profile has avatar", () => {
      const wrapper = mount(AvatarUpload, {
        props: {
          user: { ...mockUser, profile: { avatar: "https://example.com/avatar.jpg" } },
        },
        ...globalStubs,
      });

      const avatar = wrapper.find("[data-testid='avatar']");
      expect(avatar.attributes("data-image")).toBe("https://example.com/avatar.jpg");
      expect(avatar.attributes("data-label")).toBeUndefined();
    });

    it("does not show error message initially", () => {
      const wrapper = mount(AvatarUpload, {
        props: { user: mockUser },
        ...globalStubs,
      });

      expect(wrapper.find(".error-message").exists()).toBe(false);
    });

    it("does not show uploading indicator initially", () => {
      const wrapper = mount(AvatarUpload, {
        props: { user: mockUser },
        ...globalStubs,
      });

      expect(wrapper.find(".uploading").exists()).toBe(false);
    });

    it("renders hidden file input with correct accept attribute", () => {
      const wrapper = mount(AvatarUpload, {
        props: { user: mockUser },
        ...globalStubs,
      });

      const input = wrapper.find("input[type='file']");
      expect(input.exists()).toBe(true);
      expect(input.attributes("accept")).toBe(".png,.jpg,.jpeg,.gif");
    });
  });

  describe("openFileDialog", () => {
    it("does not click file input when disabled", async () => {
      const wrapper = mount(AvatarUpload, {
        props: { user: mockUser, disabled: true },
        ...globalStubs,
      });

      const input = wrapper.find("input[type='file']");
      const clickSpy = vi.spyOn(input.element, "click");

      await wrapper.find("[data-testid='avatar']").trigger("click");

      expect(clickSpy).not.toHaveBeenCalled();
    });

    it("clicks file input when avatar is clicked and not disabled", async () => {
      const wrapper = mount(AvatarUpload, {
        props: { user: mockUser },
        ...globalStubs,
      });

      const input = wrapper.find("input[type='file']");
      const clickSpy = vi.spyOn(input.element, "click");

      await wrapper.find("[data-testid='avatar']").trigger("click");

      expect(clickSpy).toHaveBeenCalled();
    });
  });

  describe("validateFile", () => {
    it("shows error when file size exceeds 500KB", async () => {
      const wrapper = mount(AvatarUpload, {
        props: { user: mockUser },
        ...globalStubs,
      });

      const largeFile = createFile("photo.png", 600 * 1024, "image/png");
      const input = wrapper.find("input[type='file']");
      Object.defineProperty(input.element, "files", { value: [largeFile] });
      await input.trigger("change");

      expect(wrapper.find(".error-message").text()).toBe("File size must not exceed 500 KB");
    });

    it("shows error when file type is not allowed", async () => {
      const wrapper = mount(AvatarUpload, {
        props: { user: mockUser },
        ...globalStubs,
      });

      const invalidFile = createFile("photo.pdf", 1024, "application/pdf");
      const input = wrapper.find("input[type='file']");
      Object.defineProperty(input.element, "files", { value: [invalidFile] });
      await input.trigger("change");

      expect(wrapper.find(".error-message").text()).toBe(
        "Only PNG, JPG, JPEG, GIF formats are supported",
      );
    });

    it("does not upload when disabled even with valid file", async () => {
      const wrapper = mount(AvatarUpload, {
        props: { user: mockUser, disabled: true },
        ...globalStubs,
      });

      const file = createFile("photo.png", 1024, "image/png");
      const input = wrapper.find("input[type='file']");
      Object.defineProperty(input.element, "files", { value: [file] });
      await input.trigger("change");

      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  describe("drag and drop", () => {
    it("sets isDragging to true on dragenter", async () => {
      const wrapper = mount(AvatarUpload, {
        props: { user: mockUser },
        ...globalStubs,
      });

      await wrapper.find(".avatar-upload").trigger("dragenter");

      expect(wrapper.find("[data-testid='avatar'].drag-over").exists()).toBe(true);
    });

    it("resets isDragging on drop", async () => {
      const wrapper = mount(AvatarUpload, {
        props: { user: mockUser },
        ...globalStubs,
      });

      await wrapper.find(".avatar-upload").trigger("dragenter");
      await wrapper.find(".avatar-upload").trigger("drop", {
        dataTransfer: { files: [] },
      });

      expect(wrapper.find("[data-testid='avatar'].drag-over").exists()).toBe(false);
    });

    it("resets isDragging on dragleave when leaving container", async () => {
      const wrapper = mount(AvatarUpload, {
        props: { user: mockUser },
        ...globalStubs,
      });

      await wrapper.find(".avatar-upload").trigger("dragenter");
      await wrapper.find(".avatar-upload").trigger("dragleave", {
        relatedTarget: document.createElement("div"),
      });

      expect(wrapper.find("[data-testid='avatar'].drag-over").exists()).toBe(false);
    });
  });
});
