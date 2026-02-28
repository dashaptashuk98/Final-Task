import type { Department } from "~~/types/departments";

export const getDepartments = async (): Promise<Department[]> => {
  const response: { data: { data: { departments: Department[] } } } = await api.post("", {
    query: `
      query {
        departments {
          id
          created_at
          name
        }
      }`,
  });
  return response.data.data.departments;
};
