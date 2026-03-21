export interface LanguageProficiency {
  name: string;
  proficiency: string;
}

export interface isProficiencyChecked extends LanguageProficiency {
  isChecked?: boolean;
}

// export interface Proficiency {
//   A1: "A1";
//   A2: "A2";
//   B1: "B1";
//   B2: "B2";
//   C1: "C1";
//   C2: "C2";
//   Native: "Native";
// }

export interface Language {
  id: number;
  created_at: string;
  iso2: string;
  name: string;
  native_name: string;
}

export type LanguageFormKeys = "language" | "proficiency";

export interface LanguageQueryVars {
  userId: number;
  name: string | string[];
}

export interface LanguageQueryVarsExt extends LanguageQueryVars {
  proficiency: string;
}

export interface createLanguageInput {
  iso2: string;
  name: string;
  native_name: string;
}

export interface updateLanguageInput extends createLanguageInput {
  languageId: number;
}

export interface deleteLanguageInput {
  languageId: number;
}
export type LanguageForm = keyof createLanguageInput;
