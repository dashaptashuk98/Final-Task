export type Nullable<T> = T | null;

export interface InputType {
  key: string;
  label: string;
  value: string | number;
  type: "InputText" | "Select";
  values?: SelectValues[];
}
export interface SelectValues {
  name: string;
}

export interface Tabs {
  label: string;
  to: string;
}

export interface sheetColumn {
  field: string;
  header: string;
}

export interface MenuData {
  label: string;
  command: () => void;
}
