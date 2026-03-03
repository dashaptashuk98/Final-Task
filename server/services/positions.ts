import type { Position } from "~/types/positions";
import { graphqlClient } from "../utils/graphqlClient";

export const getPositions = async (access_token: string): Promise<Position[]> => {
  const response = await graphqlClient.post(
    "",
    {
      query: `
        query {
          positions {
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

  return response.data.data?.positions || [];
};
