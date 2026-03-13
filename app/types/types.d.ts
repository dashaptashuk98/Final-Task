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

export interface KeyValue {
  key: string;
  value: string;
}

export interface SelectableItem {
  name: string;
  isChecked: boolean;
}
