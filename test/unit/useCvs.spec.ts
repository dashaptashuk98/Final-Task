import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { useCvs } from "@/composables/useCvs";

const { mockQuery, mockMutate, mockUseAsyncQuery } = vi.hoisted(() => ({
  mockQuery: vi.fn(),
  mockMutate: vi.fn(),
  mockUseAsyncQuery: vi.fn(),
}));

mockNuxtImport("useApollo", () => () => ({
  clients: { default: { query: mockQuery, mutate: mockMutate } },
}));
mockNuxtImport("useAsyncQuery", () => mockUseAsyncQuery);

vi.mock("@/graphQL/cvs/cvs.query", () => ({ cvQuery: "cvQuery", cvsQuery: "cvsQuery" }));
vi.mock("@/graphQL/cvs/exportProfile.mutation", () => ({ ExportPdf: "ExportPdf" }));
vi.mock("@/graphQL/cvs/project.query", () => ({
  getProjects: "getProjects",
  addProject: "addProject",
  deleteProject: "deleteProject",
  deleteCvProjectMutation: "deleteCvProjectMutation",
}));
vi.mock("@/graphQL/cvs/cvs.mutations", () => ({
  updateCvProject: "updateCvProject",
  AddSkillMutation: "AddSkillMutation",
  updateCvSkillMutation: "updateCvSkillMutation",
  deleteCvSkillMutation: "deleteCvSkillMutation",
  updateCvMutation: "updateCvMutation",
  createCvMutation: "createCvMutation",
  deleteCvMutation: "deleteCvMutation",
}));

describe("useCvs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchCv", () => {
    it("returns cv and sets state", async () => {
      mockQuery.mockResolvedValue({ data: { cv: { id: "1", name: "My CV" } } });
      const { fetchCv, cv } = useCvs();
      const result = await fetchCv("1");
      expect(result).toEqual({ id: "1", name: "My CV" });
      expect(cv.value).toEqual({ id: "1", name: "My CV" });
    });

    it("returns null when no data", async () => {
      mockQuery.mockResolvedValue({ data: null });
      const { fetchCv } = useCvs();
      expect(await fetchCv("1")).toBeNull();
    });
  });

  describe("fetchCvs", () => {
    it("returns cvs list", async () => {
      mockQuery.mockResolvedValue({ data: { cvs: [{ id: "1" }, { id: "2" }] } });
      const { fetchCvs } = useCvs();
      const result = await fetchCvs();
      expect(result).toHaveLength(2);
    });

    it("returns null when no data", async () => {
      mockQuery.mockResolvedValue({ data: null });
      const { fetchCvs } = useCvs();
      expect(await fetchCvs()).toBeNull();
    });
  });

  describe("addCvSkill", () => {
    it("returns cv and sets state", async () => {
      mockMutate.mockResolvedValue({ data: { addCvSkill: { id: "1", skills: [] } } });
      const { addCvSkill, cv } = useCvs();
      const result = await addCvSkill({ cvId: "1", skill: "JS" });
      expect(result).toEqual({ id: "1", skills: [] });
      expect(cv.value).toEqual({ id: "1", skills: [] });
    });

    it("returns null when no data", async () => {
      mockMutate.mockResolvedValue({ data: null });
      const { addCvSkill } = useCvs();
      expect(await addCvSkill({ cvId: "1" })).toBeNull();
    });
  });

  describe("updateCvSkill", () => {
    it("returns updated cv", async () => {
      mockMutate.mockResolvedValue({ data: { updateCvSkill: { id: "1" } } });
      const { updateCvSkill } = useCvs();
      expect(await updateCvSkill({ cvId: "1" })).toEqual({ id: "1" });
    });

    it("returns null when no data", async () => {
      mockMutate.mockResolvedValue({ data: null });
      const { updateCvSkill } = useCvs();
      expect(await updateCvSkill({ cvId: "1" })).toBeNull();
    });
  });

  describe("deleteCvSkill", () => {
    it("returns updated cv", async () => {
      mockMutate.mockResolvedValue({ data: { deleteCvSkill: { id: "1" } } });
      const { deleteCvSkill } = useCvs();
      expect(await deleteCvSkill({ cvId: "1" })).toEqual({ id: "1" });
    });

    it("returns null when no data", async () => {
      mockMutate.mockResolvedValue({ data: null });
      const { deleteCvSkill } = useCvs();
      expect(await deleteCvSkill({ cvId: "1" })).toBeNull();
    });
  });

  describe("createCv", () => {
    it("returns created cv", async () => {
      mockMutate.mockResolvedValue({ data: { cv: { id: "1" } } });
      const { createCv } = useCvs();
      expect(await createCv({ name: "New CV" })).toEqual({ id: "1" });
    });

    it("returns null when no data", async () => {
      mockMutate.mockResolvedValue({ data: null });
      const { createCv } = useCvs();
      expect(await createCv({ name: "New CV" })).toBeNull();
    });
  });

  describe("updateCv", () => {
    it("returns updated cv", async () => {
      mockMutate.mockResolvedValue({ data: { cv: { id: "1", name: "Updated" } } });
      const { updateCv } = useCvs();
      expect(await updateCv({ name: "Updated" })).toEqual({ id: "1", name: "Updated" });
    });

    it("returns null when no data", async () => {
      mockMutate.mockResolvedValue({ data: null });
      const { updateCv } = useCvs();
      expect(await updateCv({ name: "Updated" })).toBeNull();
    });
  });

  describe("deleteCv", () => {
    it("returns deleted cv", async () => {
      mockMutate.mockResolvedValue({ data: { cv: { cvId: "1" } } });
      const { deleteCv } = useCvs();
      expect(await deleteCv({ cvId: "1" })).toEqual({ cvId: "1" });
    });

    it("returns null when no data", async () => {
      mockMutate.mockResolvedValue({ data: null });
      const { deleteCv } = useCvs();
      expect(await deleteCv({ cvId: "1" })).toBeNull();
    });
  });

  describe("exportPdf", () => {
    it("returns pdf url", async () => {
      mockMutate.mockResolvedValue({ data: { exportPdf: "http://pdf.url" } });
      const { exportPdf } = useCvs();
      expect(await exportPdf("<html></html>")).toBe("http://pdf.url");
    });

    it("returns null when no data", async () => {
      mockMutate.mockResolvedValue({ data: null });
      const { exportPdf } = useCvs();
      expect(await exportPdf("<html></html>")).toBeNull();
    });
  });

  describe("addCvProject", () => {
    it("returns cv and sets state", async () => {
      mockMutate.mockResolvedValue({ data: { addCvProject: { id: "1", projects: [] } } });
      const { addCvProject, cv } = useCvs();
      const result = await addCvProject({ cvId: "1" });
      expect(result).toEqual({ id: "1", projects: [] });
      expect(cv.value).toEqual({ id: "1", projects: [] });
    });

    it("returns null when no data", async () => {
      mockMutate.mockResolvedValue({ data: null });
      const { addCvProject } = useCvs();
      expect(await addCvProject({ cvId: "1" })).toBeNull();
    });
  });

  describe("updateCvProjectData", () => {
    it("returns updated cv", async () => {
      mockMutate.mockResolvedValue({ data: { updateCvProject: { id: "1" } } });
      const { updateCvProjectData } = useCvs();
      expect(await updateCvProjectData({ cvId: "1" })).toEqual({ id: "1" });
    });

    it("returns null when no data", async () => {
      mockMutate.mockResolvedValue({ data: null });
      const { updateCvProjectData } = useCvs();
      expect(await updateCvProjectData({ cvId: "1" })).toBeNull();
    });
  });

  describe("deleteCvProject", () => {
    it("returns updated cv", async () => {
      mockMutate.mockResolvedValue({ data: { removeCvProject: { id: "1" } } });
      const { deleteCvProject } = useCvs();
      expect(await deleteCvProject("1", "p1")).toEqual({ id: "1" });
    });

    it("returns null when no data", async () => {
      mockMutate.mockResolvedValue({ data: null });
      const { deleteCvProject } = useCvs();
      expect(await deleteCvProject("1", "p1")).toBeNull();
    });
  });
});
