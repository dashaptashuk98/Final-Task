import type { LanguageProficiency } from "./languages";
import type { Project } from "./projects";
import type { SkillMastery } from "./skills";
import type { Nullable } from "./types";
import type { User } from "./user";

export interface Cv {
  id: string;
  created_at: string;
  name: string;
  education: Nullable<string>;
  description: string;
  user?: Nullable<User>;
  projects?: Nullable<CvProject[]>;
  skills: SkillMastery[];
  languages: LanguageProficiency[];
}
export interface CvProject {
  id: string;
  project: Project;
  name: string;
  internal_name: string;
  description: string;
  domain: string;
  start_date: string;
  end_date?: Nullable<string>;
  environment: string[];
  roles: string[];
  responsibilities: string[];
}

export interface UpdateCvInput {
  cvId: string;
  name: string;
  education: Nullable<string>;
  description: string;
}

export interface DeleteCvInput {
  cvId: number;
}

export type UpdateCvResponse = Pick<CvProject, "id" | "name" | "education" | "description">;
