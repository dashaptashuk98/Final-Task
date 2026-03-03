export interface UserProfile {
  first_name: string;
  last_name: string;
  full_name: string;
  avatar?: string;
}

export interface UserDepartment {
  name: string;
}

export interface UserPosition {
  name: string;
}

export interface MenuItem {
  icon?: string;
  name: string;
  title: string;
  to: string;
  isActive: boolean;
}

export interface User {
  id: string;
  email: string;
  profile?: {
    first_name?: string;
    last_name?: string;
    full_name?: string;
    avatar?: string | null;
  };
  department?: {
    name: string;
  } | null;
  position?: {
    name: string;
  } | null;
  role?: string;
  is_verified?: boolean;
}
