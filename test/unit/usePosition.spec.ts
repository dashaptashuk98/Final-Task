import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { usePositions } from "@/composables/usePositions";

const { mockQuery, mockMutate } = vi.hoisted(() => ({
  mockQuery: vi.fn(),
  mockMutate: vi.fn(),
}));

mockNuxtImport("useApollo", () => () => ({
  clients: { default: { query: mockQuery, mutate: mockMutate } },
}));

vi.mock("@/graphQL/positions/positions.query", () => ({
  positionsQuery: "positions",
}));

vi.mock("@/graphQL/positions/position.mutation", () => ({
  createPositionMutation: "createPosition",
  deletePositionMutation: "updatePosition",
  updatePositionMutation: "deletePosition",
}));

describe("usePositions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe("fetchPositions", () => {
    it("returns positions array", async () => {
      mockQuery.mockResolvedValue({ data: { positions: [{ id: "1" }] } });
      const { fetchPositions } = usePositions();
      const result = await fetchPositions();
      expect(result).toHaveLength(1);
    });

    it("returns null when no data", async () => {
      mockQuery.mockResolvedValue({ data: null });
      const { fetchPositions } = usePositions();
      expect(await fetchPositions()).toBeNull();
    });
  });

  describe("createPosition", () => {
    it("returns created position", async () => {
      mockMutate.mockResolvedValue({ data: { createPosition: { name: "newPosition" } } });
      const { createPosition } = usePositions();
      const result = await createPosition({ name: "newPosition" });
      expect(result).toEqual({ name: "newPosition" });
    });
    it("returns null if variables are falsy", async () => {
      mockMutate.mockResolvedValue({ data: null });
      const { createPosition } = usePositions();
      expect(await createPosition({ name: null })).toBeNull();
    });
  });

  describe("updatePosition", () => {
    it("returns updated position", async () => {
      mockMutate.mockResolvedValue({ data: { updatePosition: { name: "newPosition", id: "1" } } });
      const { updatePosition } = usePositions();
      const result = await updatePosition({ name: "newPosition", positionId: "1" });
      expect(result).toEqual({ name: "newPosition", id: "1" });
    });
    it("returns null if variables are falsy", async () => {
      mockMutate.mockResolvedValue({ data: null });
      const { updatePosition } = usePositions();
      expect(await updatePosition({ name: null, positionId: null })).toBeNull();
    });
  });

  describe("deletePosition", () => {
    it("returns affected position", async () => {
      mockMutate.mockResolvedValue({ data: { deletePosition: { affected: 1 } } });
      const { deletePosition } = usePositions();
      const result = await deletePosition({ positionId: "1" });
      expect(result).toEqual({ affected: 1 });
    });
    it("returns null if variables are falsy", async () => {
      mockMutate.mockResolvedValue({ data: null });
      const { deletePosition } = usePositions();
      expect(await deletePosition({ positionId: null })).toBeNull();
    });
  });
});
