import type { Department } from "~/types/departments";
import { graphqlClient } from "../utils/graphqlClient";

export const getDepartments = async (access_token: string): Promise<Department[]> => {
  const response = await graphqlClient.post(
    "",
    {
      query: `
        query {
          departments {
            id
            created_at
            name
          }
        }`,
    },
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  );

  if (response.data.errors) {
    throw new Error(response.data.errors[0].message);
  }

  return response.data.data?.departments || [];
};
