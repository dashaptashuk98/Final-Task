export interface Department {
  id: string;
  created_at: string;
  name: string;
}

export interface CreateDepartmentInput {
  name: string;
}

export interface UpdateDepartmentInput {
  departmentId: string;
  name: string;
}

export interface DeleteDepartmentInput {
  departmentId: string;
}
