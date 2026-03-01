import type { Position } from "~~/types/positions";

export const getPositions = async (): Promise<Position[]> => {
  const response: { data: { data: { positions: Position[] } } } = await api.post("", {
    query: `
      query {
        positions {
          id
          created_at
          name
        }
      }`,
  });
  return response.data.data.positions;
};
