import { describe, it, expect, vi, beforeEach } from "vitest";
import { useDataTable } from "@/composables/useDataTable";

beforeEach(() => {
  const { sheetData, isModalVisible, isDeleteModalVisible, selectedRow, modalHeader } =
    useDataTable();
  sheetData.value = null;
  isModalVisible.value = false;
  isDeleteModalVisible.value = false;
  selectedRow.value = null;
  modalHeader.value = "";
});

describe("useDataTable", () => {
  describe("initial state", () => {
    it("initializes with correct defaults", () => {
      const { isModalVisible, isDeleteModalVisible, modalHeader, selectedRow } = useDataTable();
      expect(isModalVisible.value).toBe(false);
      expect(isDeleteModalVisible.value).toBe(false);
      expect(modalHeader.value).toBe("");
      expect(selectedRow.value).toBeNull();
    });
  });

  describe("activateModal", () => {
    it("sets header and opens modal", () => {
      const { activateModal, isModalVisible, modalHeader } = useDataTable();
      const form = { name: "", description: "" };
      activateModal("Edit CV", form);
      expect(isModalVisible.value).toBe(true);
      expect(modalHeader.value).toBe("Edit CV");
    });
  });

  describe("updateSheetItem", () => {
    it("calls updateService when changedData is provided", async () => {
      const { updateSheetItem } = useDataTable();
      const mockService = vi.fn();
      await updateSheetItem({ id: "1" }, mockService);
      expect(mockService).toHaveBeenCalledWith({ id: "1" });
    });

    it("does not call updateService when changedData is falsy", async () => {
      const { updateSheetItem } = useDataTable();
      const mockService = vi.fn();
      await updateSheetItem(null, mockService);
      expect(mockService).not.toHaveBeenCalled();
    });
  });

  describe("deleteSheetItem", () => {
    it("calls deleteService when selectedRow is set", async () => {
      const { deleteSheetItem, selectedRow, isDeleteModalVisible } = useDataTable();
      selectedRow.value = { id: "1" } as unknown as typeof selectedRow.value;
      const mockDelete = vi.fn();
      const mockUpdate = vi.fn().mockResolvedValue([{ id: "2" }]);
      await deleteSheetItem(mockDelete, mockUpdate, { cvId: "1" });
      expect(mockDelete).toHaveBeenCalledWith({ cvId: "1" });
      expect(isDeleteModalVisible.value).toBe(false);
      expect(selectedRow.value).toBeNull();
    });

    it("does not call deleteService when selectedRow is null", async () => {
      const { deleteSheetItem } = useDataTable();
      const mockDelete = vi.fn();
      const mockUpdate = vi.fn().mockResolvedValue([]);
      await deleteSheetItem(mockDelete, mockUpdate, { cvId: "1" });
      expect(mockDelete).not.toHaveBeenCalled();
    });

    it("updates sheetData after deletion", async () => {
      const { deleteSheetItem, selectedRow, sheetData } = useDataTable();
      selectedRow.value = { id: "1" } as unknown as typeof selectedRow.value;
      const mockDelete = vi.fn();
      const mockUpdate = vi.fn().mockResolvedValue([{ id: "2" }]);
      await deleteSheetItem(mockDelete, mockUpdate, {});
      expect(sheetData.value).toEqual([{ id: "2" }]);
    });
  });

  describe("handleMutateConfirmation", () => {
    it("updates sheetData and closes modal when sheetData exists", async () => {
      const { handleMutateConfirmation, sheetData, isModalVisible, selectedRow } = useDataTable();
      sheetData.value = [{ id: "1" }] as unknown as typeof sheetData.value;
      isModalVisible.value = true;
      selectedRow.value = { id: "1" } as unknown as typeof selectedRow.value;
      const mockUpdate = vi.fn().mockResolvedValue([{ id: "2" }]);
      await handleMutateConfirmation(mockUpdate);
      expect(sheetData.value).toEqual([{ id: "2" }]);
      expect(isModalVisible.value).toBe(false);
      expect(selectedRow.value).toBeNull();
    });

    it("still closes modal when sheetData is null", async () => {
      const { handleMutateConfirmation, isModalVisible } = useDataTable();
      isModalVisible.value = true;
      const mockUpdate = vi.fn();
      await handleMutateConfirmation(mockUpdate);
      expect(mockUpdate).not.toHaveBeenCalled();
      expect(isModalVisible.value).toBe(false);
    });
  });
});
