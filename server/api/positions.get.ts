import type { Position } from "~~/types/positions";
import { getPositions } from "../services/positions";

export default defineEventHandler(async (event): Promise<Position[]> => {
  if (!event) {
    throw createError({
      statusCode: 400,
      statusMessage: "Error",
    });
  }
  return await getPositions();
});
