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

export interface User {
  id: string;
  email: string;
  role?: string;
  is_verified?: boolean;
  profile?: UserProfile;
  department?: UserDepartment;
  position?: UserPosition;
}

export interface UserUI {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  avatar: string | null;
  role: string;
  isVerified: boolean;
}
