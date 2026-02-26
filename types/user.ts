export interface UserProfile {
  first_name: string;
  last_name: string;
  full_name: string;
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
