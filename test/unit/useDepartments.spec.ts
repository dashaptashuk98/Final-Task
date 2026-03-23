import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { useDepartments } from "@/composables/useDepartments";

const { mockQuery, mockMutate } = vi.hoisted(() => ({
  mockQuery: vi.fn(),
  mockMutate: vi.fn(),
}));

mockNuxtImport("useApollo", () => () => ({
  clients: { default: { query: mockQuery, mutate: mockMutate } },
}));

vi.mock("@/graphQL/departments/departments.query", () => ({
  departmentsQuery: "departments",
  createDepartmentMutation: "createDepartment",
  updateDepartmentMutation: "updateDepartment",
  deleteDepartmentMutation: "deleteDepartment",
}));

describe("useDepartments", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe("fetchDepartments", () => {
    it("returns departments array and sets state", async () => {
      mockQuery.mockResolvedValue({ data: { departments: [{ id: "1" }] } });
      const { fetchDepartments, departments } = useDepartments();
      const result = await fetchDepartments();
      expect(result).toHaveLength(1);
      expect(departments.value).toHaveLength(1);
    });

    it("returns null when no data", async () => {
      mockQuery.mockResolvedValue({ data: null });
      const { fetchDepartments } = useDepartments();
      expect(await fetchDepartments()).toBeNull();
    });
  });

  describe("createDepartment", () => {
    it("returns created department", async () => {
      mockMutate.mockResolvedValue({ data: { createDepartment: { name: "new department" } } });
      const { createDepartment } = useDepartments();
      const result = await createDepartment({ name: "new department" });
      expect(result).toEqual({ name: "new department" });
    });
    it("returns null if variables are falsy", async () => {
      mockMutate.mockResolvedValue({ data: null });
      const { createDepartment } = useDepartments();
      expect(await createDepartment({ name: null })).toBeNull();
    });
  });

  describe("updateDepartment", () => {
    it("returns updated department", async () => {
      mockMutate.mockResolvedValue({
        data: { updateDepartment: { name: "new department", departmentId: "1" } },
      });
      const { updateDepartment } = useDepartments();
      const result = await updateDepartment({ name: "new department", departmentId: "1" });
      expect(result).toEqual({ name: "new department", departmentId: "1" });
    });
    it("returns null if variables are falsy", async () => {
      mockMutate.mockResolvedValue({ data: null });
      const { updateDepartment } = useDepartments();
      expect(await updateDepartment({ name: null, departmentId: null })).toBeNull();
    });
  });

  describe("deleteDepartment", () => {
    it("returns affected department", async () => {
      mockMutate.mockResolvedValue({ data: { deleteDepartment: { affected: 1 } } });
      const { deleteDepartment } = useDepartments();
      const result = await deleteDepartment({ departmentId: "1" });
      expect(result).toEqual({ affected: 1 });
    });
    it("returns null if variables are falsy", async () => {
      mockMutate.mockResolvedValue({ data: null });
      const { deleteDepartment } = useDepartments();
      expect(await deleteDepartment({ departmentId: null })).toBeNull();
    });
  });
});
