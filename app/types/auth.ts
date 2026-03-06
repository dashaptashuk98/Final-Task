import type { User } from "./user";
import type { UserProfile, UserDepartment, UserPosition } from "./userTable";

export interface AuthResponse {
  login: AuthResult;
}
export interface AuthResult {
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface AuthInput {
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthField {
  key: string;
  label: string;
  type: "email" | "password" | "text";
  value: string;
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
}

interface ErrorWithMessage {
  message: string;
}

interface ErrorWithError {
  error: string;
}

export type ApiError = string | ErrorWithMessage | ErrorWithError | null;

export interface LoginResponse {
  success: boolean;
  user?: User;
  access_token?: string;
  refresh_token?: string;
  message?: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  profile?: {
    first_name?: string;
    last_name?: string;
    avatar?: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  user?: User;
  access_token?: string;
  refresh_token?: string;
  message?: string;
}

export interface UserSession {
  id: string;
  email: string;
  role: string;
  is_verified: boolean;
  profile?: UserProfile;
  department?: UserDepartment;
  position?: UserPosition;
}

export interface SecureSessionData {
  access_token: string;
  refresh_token: string;
}

export interface Session {
  user: UserSession;
  secure: SecureSessionData;
}

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  statusCode?: number;
  message?: string;
}

export interface RefreshResponse {
  success: boolean;
  updateToken: {
    access_token: string;
    refresh_token: string;
  };
}

export interface UpdateTokenResult {
  updateToken: {
    access_token: string;
    refresh_token: string;
  };
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

export interface UsersWithPagination {
  users: User[];
  totalCount: number;
  pageInfo?: PageInfo;
}
export interface UsersResponse {
  users: User[];
}

export interface UserResponse {
  user: User;
}
