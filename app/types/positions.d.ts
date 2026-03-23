export interface Position {
  id: string;
  created_at: string;
  name: string;
}
export type PositionForm = "name";

export interface CreatePositionInput {
  name: string;
}

export interface DeletePositionInput {
  positionId: number;
}

export type UpdatePositionInput = CreatePositionInput | DeletePositionInput;
