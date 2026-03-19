import type { Cv } from "~/types/cvs";
import type { Nullable } from "~/types/types";

export const useDataTable = () => {
  const isModalVisible = ref<boolean>(false);
  const isDeleteModalVisible = ref<boolean>(false);
  const sheetData = useState<Nullable<Cv[]>>(() => null);
  const modalHeader = ref<string>("");
  const selectedRow = ref<Nullable<Cv>>(null);

  const activateModal = <T extends Record<string, unknown>>(
    header: string,
    form: T,
    data?: Partial<T> | null,
  ) => {
    modalHeader.value = header;
    isModalVisible.value = true;
    formMapper(form, data);
  };

  const formMapper = <T extends Record<string, unknown>>(
    form: T,
    data?: Partial<T> | null,
  ): void => {
    if (!data) {
      Object.keys(form).forEach((key) => (form[key as keyof T] = "" as T[keyof T]));
      return;
    }
    Object.keys(form).forEach(
      (key) => (form[key as keyof T] = data[key as keyof T] ?? form[key as keyof T]),
    );
  };

  const updateSheetItem = async <T>(
    changedData: T,
    updateService: (vars: T) => unknown,
  ): Promise<void> => {
    if (changedData) {
      await updateService(changedData);
    }
  };

  const deleteSheetItem = async <T, K>(
    deleteService: (vars: K) => unknown,
    updateSheetService: (vars?: T) => Promise<Nullable<Cv[]>>,
    variable: K,
  ): Promise<void> => {
    if (selectedRow.value) {
      await deleteService(variable);
    }
    isDeleteModalVisible.value = false;
    selectedRow.value = null;
    sheetData.value = await updateSheetService();
  };

  const handleMutateConfirmation = async <T>(
    updateSheetService: (vars?: T) => Promise<Nullable<Cv[]>>,
  ): Promise<void> => {
    if (sheetData.value) {
      sheetData.value = await updateSheetService();
    }
    isModalVisible.value = false;
    selectedRow.value = null;
  };

  return {
    isModalVisible,
    isDeleteModalVisible,
    modalHeader,
    sheetData,
    selectedRow,
    activateModal,
    updateSheetItem,
    handleMutateConfirmation,
    deleteSheetItem,
  };
};
