import type { Cv } from "./cvs";
import type { Department } from "./departments";
import type { LanguageProficiency } from "./languages";
import type { Position } from "./positions";
import type { SkillMastery } from "./skills";
import type { Nullable } from "./types";
import type { AuthInput } from "./auth";
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

export interface uploadPhotoProps {
  user: {
    id: string;
    email: string;
    profile?: {
      avatar?: string;
    };
  };
  disabled?: boolean;
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

export interface UserMutation {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  department: string;
  position: string;
  role: string;
}

export type UserFormKeys =
  | "email"
  | "password"
  | "first_name"
  | "last_name"
  | "department"
  | "position"
  | "role";

export interface UpdateUserInput {
  userId: number;
  cvsIds: string[];
  departmentId: number;
  positionId: number;
  role: UserRole;
}

export interface CreateUserInput {
  auth: AuthInput;
  profile: CreateProfileInput;
  cvsIds: string[];
  departmentId: number;
  positionId: number;
  role: UserRole;
}

export type CreateProfileInput = Pick<"first_name" | "last_name", Profile>;
