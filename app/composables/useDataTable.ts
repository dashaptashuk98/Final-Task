import type { Nullable } from "~/types/types";

export const useDataTable = <T>() => {
  const isModalVisible = ref<boolean>(false);
  const isDeleteModalVisible = ref<boolean>(false);
  const sheetData = useState<Nullable<T[]>>(() => null);
  const modalHeader = ref<string>("");
  const selectedRow = ref<Nullable<T>>(null);

  const activateModal = <F extends object>(header: string, form: F, data?: Partial<F> | null) => {
    modalHeader.value = header;
    isModalVisible.value = true;
    if (header.includes("CV")) {
      formMapper<F>(form, data);
    }
  };

  const formMapper = <F extends object>(form: F, data?: Partial<F> | null): void => {
    if (!data) {
      Object.keys(form).forEach((key) => (form[key as keyof F] = "" as F[keyof F]));
      return;
    }
    Object.keys(form).forEach(
      (key) => (form[key as keyof F] = data[key as keyof F] ?? form[key as keyof F]),
    );
  };

  const updateSheetItem = async <V>(
    changedData: V,
    updateService: (vars: V) => unknown,
  ): Promise<void> => {
    if (changedData) {
      await updateService(changedData);
    }
  };

  const deleteSheetItem = async <V, K>(
    deleteService: (vars: V) => unknown,
    updateSheetService: (vars?: K) => Promise<Nullable<T[]>>,
    variable: V,
  ): Promise<void> => {
    if (selectedRow.value) {
      await deleteService(variable);
    }
    isDeleteModalVisible.value = false;
    selectedRow.value = null;
    sheetData.value = await updateSheetService();
  };

  const handleMutateConfirmation = async <V>(
    updateSheetService: (vars?: V) => Promise<Nullable<T[]>>,
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
