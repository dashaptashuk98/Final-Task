import {
  createPositionMutation,
  deletePositionMutation,
  updatePositionMutation,
} from "~/graphQL/positions/posiiton.mutation";
import { positionsQuery } from "~/graphQL/positions/positions.query";
import type {
  CreatePositionInput,
  DeletePositionInput,
  Position,
  UpdatePositionInput,
} from "~/types/positions";
import type { Nullable } from "~/types/types";

export const usePositions = () => {
  const { clients } = useApollo();
  const positions = useState<Position[]>("positions", () => []);
  const fetchPositions = async (): Promise<Nullable<Position[]>> => {
    if (clients) {
      const { data } = await clients.default.query({
        query: positionsQuery,
        fetchPolicy: "no-cache",
      });
      if (data) {
        return data.positions;
      }
    }
    return null;
  };
  const createPosition = async (name: CreatePositionInput): Promise<Nullable<Position>> => {
    if (clients) {
      const { data } = await clients.default.mutate({
        mutation: createPositionMutation,
        variables: { position: name },
      });
      if (data) {
        return data.createPosition;
      }
    }
    return null;
  };
  const updatePosition = async (position: UpdatePositionInput): Promise<Nullable<Position>> => {
    if (clients) {
      const { data } = await clients.default.mutate({
        mutation: updatePositionMutation,
        variables: { position: position },
      });
      if (data) {
        return data.updatePosition;
      }
    }
    return null;
  };
  const deletePosition = async (positionId: DeletePositionInput): Promise<Nullable<Position>> => {
    if (clients) {
      const { data } = await clients.default.mutate({
        mutation: deletePositionMutation,
        variables: { position: positionId },
      });
      if (data) {
        return data.deletePosition;
      }
    }
    return null;
  };
  return { positions, fetchPositions, createPosition, updatePosition, deletePosition };
};
