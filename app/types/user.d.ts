import type { Cv } from "./cvs";
import type { Department } from "./departments";
import type { LanguageProficiency } from "./languages";
import type { Position } from "./positions";
import type { SkillMastery } from "./skills";
import type { Nullable } from "./types";

export interface UserResponse {
  users: User[];
}
export interface User {
  id: string;
  created_at: string;
  email: string;
  is_verified: boolean;
  profile: Profile;
  cvs?: Nullable<Cv[]>;
  department?: Nullable<Department>;
  department_name?: Nullable<string>;
  position?: Nullable<Position>;
  position_name?: Nullable<string>;
  role: UserRole;
}

export interface Profile {
  id: string;
  created_at: string;
  first_name?: Nullable<string>;
  last_name?: Nullable<string>;
  full_name?: Nullable<string>;
  avatar?: Nullable<string>;
  skills: SkillMastery[];
  languages: LanguageProficiency[];
}

export type UserRole = "Employee" | "Admin";

export type ProfileForm = "firstName" | "lastName" | "department" | "position";
