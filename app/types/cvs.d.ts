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

export interface AddCvProjectInput {
  cvId: string;
  projectId: string;
  start_date: string;
  end_date?: string | null;
  roles: string[];
  responsibilities: string[];
}

export interface AddCvSkillInput {
  cvId: string;
  name: string;
  categoryId: string;
  mastery: string;
}

export interface UpdateCvSkillInput {
  cvId: string;
  name: string;
  categoryId: string;
  mastery: string;
}

export interface DeleteCvSkillInput {
  cvId: string;
  name: string[];
}

export interface UpdateCvProjectInput {
  cvId: string;
  projectId: string;
  start_date: string;
  end_date?: string | null;
  roles: string[];
  responsibilities: string[];
}
export interface Project {
  id: string;
  created_at: string;
  name: string;
  internal_name: string;
  domain: string;
  start_date: string;
  end_date?: string | null;
  description: string;
  environment: string[];
}

export type UpdateCvResponse = Pick<CvProject, "id" | "name" | "education" | "description">;
