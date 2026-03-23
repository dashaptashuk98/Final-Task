import {
  departmentsQuery,
  createDepartmentMutation,
  updateDepartmentMutation,
  deleteDepartmentMutation,
} from "~/graphQL/departments/departments.query";
import type {
  CreateDepartmentInput,
  DeleteDepartmentInput,
  Department,
  UpdateDepartmentInput,
} from "~/types/departments";
import type { Nullable } from "~/types/types";

export const useDepartments = () => {
  const { clients } = useApollo();
  const departments = useState<Nullable<Department[]>>("departments", () => []);

  const fetchDepartments = async (): Promise<Nullable<Department[]>> => {
    if (clients) {
      const { data } = await clients.default.query({
        query: departmentsQuery,
        fetchPolicy: "no-cache",
      });
      if (data) {
        departments.value = data.departments;
        return data.departments;
      }
    }
    return null;
  };

  const createDepartment = async (
    department: CreateDepartmentInput,
  ): Promise<Nullable<Department>> => {
    if (clients) {
      const { data } = await clients.default.mutate({
        mutation: createDepartmentMutation,
        variables: { department: department },
      });
      if (data) {
        return data.createDepartment;
      }
    }
    return null;
  };

  const updateDepartment = async (
    department: UpdateDepartmentInput,
  ): Promise<Nullable<Department>> => {
    if (clients) {
      const { data } = await clients.default.mutate({
        mutation: updateDepartmentMutation,
        variables: { department: department },
      });
      if (data) {
        return data.updateDepartment;
      }
    }
    return null;
  };

  const deleteDepartment = async (
    department: DeleteDepartmentInput,
  ): Promise<Nullable<{ affected: number }>> => {
    if (clients) {
      const { data } = await clients.default.mutate({
        mutation: deleteDepartmentMutation,
        variables: { department: department },
      });
      if (data) {
        return data.deleteDepartment;
      }
    }
    return null;
  };

  return {
    departments,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  };
};
