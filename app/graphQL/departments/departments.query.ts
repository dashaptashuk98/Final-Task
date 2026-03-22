export const departmentsQuery = gql`
  query {
    departments {
      id
      created_at
      name
    }
  }
`;

export const createDepartmentMutation = gql`
  mutation createDepartment($department: CreateDepartmentInput!) {
    createDepartment(department: $department) {
      id
      created_at
      name
    }
  }
`;

export const updateDepartmentMutation = gql`
  mutation updateDepartment($department: UpdateDepartmentInput!) {
    updateDepartment(department: $department) {
      id
      created_at
      name
    }
  }
`;

export const deleteDepartmentMutation = gql`
  mutation deleteDepartment($department: DeleteDepartmentInput!) {
    deleteDepartment(department: $department) {
      affected
    }
  }
`;
