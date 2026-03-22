import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { useLanguages } from "@/composables/useLanguages";

const { mockQuery, mockMutate } = vi.hoisted(() => ({
  mockQuery: vi.fn(),
  mockMutate: vi.fn(),
}));

mockNuxtImport("useApollo", () => () => ({
  clients: { default: { query: mockQuery, mutate: mockMutate } },
}));

vi.mock("@/graphQL/languages/languages.query", () => ({
  languagesQuery: "languages",
}));

vi.mock("@/graphQL/languages/languages.mutation", () => ({
  createLanguageMutation: "createLanguage",
  deleteLanguageMutation: "updateLanguage",
  updateLanguageMutation: "deleteLanguage",
}));

describe("useLanguages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe("fetchLanguages", () => {
    it("returns languages array", async () => {
      mockQuery.mockResolvedValue({ data: { languages: [{ id: "1" }] } });
      const { fetchLanguages } = useLanguages();
      const result = await fetchLanguages();
      expect(result).toHaveLength(1);
    });

    it("returns null when no data", async () => {
      mockQuery.mockResolvedValue({ data: null });
      const { fetchLanguages } = useLanguages();
      expect(await fetchLanguages()).toBeNull();
    });
  });

  describe("createLanguage", () => {
    it("returns created language", async () => {
      mockMutate.mockResolvedValue({
        data: { createLanguage: { name: "newLanguage", iso2: "NL", native_name: "newlang" } },
      });
      const { createLanguage } = useLanguages();
      const result = await createLanguage({
        name: "newLanguage",
        iso2: "NL",
        native_name: "newlang",
      });
      expect(result).toEqual({ name: "newLanguage", iso2: "NL", native_name: "newlang" });
    });
    it("returns null if variables are falsy", async () => {
      mockMutate.mockResolvedValue({ data: null });
      const { createLanguage } = useLanguages();
      expect(await createLanguage({ name: null, iso2: null, native_name: null })).toBeNull();
    });
  });

  describe("updateLanguage", () => {
    it("returns updated language", async () => {
      mockMutate.mockResolvedValue({
        data: {
          updateLanguage: {
            name: "newLanguage",
            languageId: "1",
            iso2: "NL",
            native_name: "newlang",
          },
        },
      });
      const { updateLanguage } = useLanguages();
      const result = await updateLanguage({
        name: "newLanguage",
        languageId: "1",
        iso2: "NL",
        native_name: "newlang",
      });
      expect(result).toEqual({
        name: "newLanguage",
        languageId: "1",
        iso2: "NL",
        native_name: "newlang",
      });
    });
    it("returns null if variables are falsy", async () => {
      mockMutate.mockResolvedValue({ data: null });
      const { updateLanguage } = useLanguages();
      expect(
        await updateLanguage({ name: null, languageId: null, iso2: null, native_name: null }),
      ).toBeNull();
    });
  });

  describe("deleteLanguage", () => {
    it("returns affected language", async () => {
      mockMutate.mockResolvedValue({ data: { deleteLanguage: { affected: 1 } } });
      const { deleteLanguage } = useLanguages();
      const result = await deleteLanguage({ languageId: "1" });
      expect(result).toEqual({ affected: 1 });
    });
    it("returns null if variables are falsy", async () => {
      mockMutate.mockResolvedValue({ data: null });
      const { deleteLanguage } = useLanguages();
      expect(await deleteLanguage({ languageId: null })).toBeNull();
    });
  });
});
