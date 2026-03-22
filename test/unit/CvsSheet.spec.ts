import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import CvsSheet from "@/components/CvsSheet.vue";
import PrimeVue from "primevue/config";

const { checkRightsMock, navigateToMock } = vi.hoisted(() => ({
  checkRightsMock: vi.fn(() => true),
  navigateToMock: vi.fn(),
}));

mockNuxtImport("checkRights", () => checkRightsMock);
mockNuxtImport("navigateTo", () => navigateToMock);

const mountOptions = { global: { plugins: [PrimeVue] } };

const defaultProps = {
  columns: [{ field: "name", header: "Name" }],
  sheetData: [{ id: "1", name: "CV One", description: "desc" }],
  contextMenu: [{ label: "Edit", command: vi.fn() }],
  page: "cvs",
  buttonLabel: "ADD CV",
  userId: "1",
};

describe("CvsSheet", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkRightsMock.mockReturnValue(true);
  });

  it("renders DataTable with sheetData", () => {
    const wrapper = mount(CvsSheet, { ...mountOptions, props: defaultProps });
    expect(wrapper.findComponent({ name: "DataTable" }).exists()).toBe(true);
  });

  it("renders ContextMenu", () => {
    const wrapper = mount(CvsSheet, { ...mountOptions, props: defaultProps });
    expect(wrapper.findComponent({ name: "ContextMenu" }).exists()).toBe(true);
  });

  it("renders SheetHeader", () => {
    const wrapper = mount(CvsSheet, { ...mountOptions, props: defaultProps });
    expect(wrapper.findComponent({ name: "SheetHeader" }).exists()).toBe(true);
  });

  it("navigates to cv details on row click for cvs page", async () => {
    const wrapper = mount(CvsSheet, { ...mountOptions, props: defaultProps });
    const vm = wrapper.vm as unknown as {
      handleRowClick: (e: { data: { id: string } | null }) => Promise<void>;
    };
    await vm.handleRowClick({ data: { id: "1" } });
    expect(navigateToMock).toHaveBeenCalledWith("/cvs/1/details");
  });

  it("navigates to user profile on row click for users page", async () => {
    const wrapper = mount(CvsSheet, {
      ...mountOptions,
      props: { ...defaultProps, page: "users" },
    });
    const vm = wrapper.vm as unknown as {
      handleRowClick: (e: { data: { id: string } | null }) => Promise<void>;
    };
    await vm.handleRowClick({ data: { id: "2" } });
    expect(navigateToMock).toHaveBeenCalledWith("/users/2/profile");
  });

  it("navigates to project on row click for projects page", async () => {
    const wrapper = mount(CvsSheet, {
      ...mountOptions,
      props: { ...defaultProps, page: "projects" },
    });
    const vm = wrapper.vm as unknown as {
      handleRowClick: (e: { data: { id: string } | null }) => Promise<void>;
    };
    await vm.handleRowClick({ data: { id: "3" } });
    expect(navigateToMock).toHaveBeenCalledWith("/projects/3");
  });

  it("does not navigate when row data is empty", async () => {
    const wrapper = mount(CvsSheet, { ...mountOptions, props: defaultProps });
    const vm = wrapper.vm as unknown as { handleRowClick: (e: { data: null }) => Promise<void> };
    await vm.handleRowClick({ data: null });
    expect(navigateToMock).not.toHaveBeenCalled();
  });

  it("emits handleSelectedItem on handleOptionPick", async () => {
    const wrapper = mount(CvsSheet, { ...mountOptions, props: defaultProps });
    const vm = wrapper.vm as unknown as {
      cm: { show: ReturnType<typeof vi.fn> };
      handleOptionPick: (e: MouseEvent, item: object) => void;
    };
    vm.cm = { show: vi.fn() };
    const mockEvent = new MouseEvent("click");
    vm.handleOptionPick(mockEvent, { id: "1", name: "CV One" });
    expect(wrapper.emitted("handleSelectedItem")?.[0]).toEqual([{ id: "1", name: "CV One" }]);
  });

  it("passes correct isVisible to SheetHeader when userId and page is not users", () => {
    const wrapper = mount(CvsSheet, { ...mountOptions, props: defaultProps });
    const sheetHeader = wrapper.findComponent({ name: "SheetHeader" });
    expect(sheetHeader.props("isVisible")).toBe(true);
  });

  it("passes checkRights() without userId when page is users", () => {
    const _wrapper = mount(CvsSheet, {
      ...mountOptions,
      props: { ...defaultProps, page: "users", userId: "" },
    });
    expect(checkRightsMock).toHaveBeenCalled();
  });
});
