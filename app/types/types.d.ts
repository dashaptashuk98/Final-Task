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

export type ProjectFormKey =
  | "skill"
  | "mastery"
  | "start"
  | "end"
  | "description"
  | "environment"
  | "responsibilities";
