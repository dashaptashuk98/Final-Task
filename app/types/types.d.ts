export type Nullable<T> = T | null;

export interface InputType {
  key: string;
  label: string;
  value: string | number | Date | string[];
  type: "InputText" | "Select" | "DatePicker" | "MultiSelect" | "Textarea";
  values?: (SelectValues | string)[];
  disabled?: boolean;
}
export interface SelectValues {
  name: string;
}

export interface Tabs {
  label: string;
  to: string;
}

export type DepartmentFormKey = "name";

export type ProjectFormKey = "name" | "domain" | "start" | "end" | "description" | "environment";

export type CvProjectFormKey = ProjectFormKey | "responsibilities";
export interface sheetColumn {
  field: string;
  header?: string;
}

export interface MenuData {
  label: string;
  command: () => void;
}

export interface KeyValue {
  key: string;
  value: string;
}

export interface SelectableItem {
  name: string;
  isChecked: boolean;
}

export interface filterProps {
  value: string;
  matchMode: string;
}

export interface IdVar {
  id?: string;
  userId?: string;
  cvId?: string;
}
