import type { Position } from "~/types/positions";
import { getPositions } from "../services/positions";
import type { Session } from "~/types/auth";

export default defineEventHandler(async (event): Promise<Position[]> => {
  try {
    const sessionData = await requireUserSession(event);
    const session = sessionData as unknown as Session;
    const access_token = session.secure?.access_token;

    if (!access_token) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "Токен не найден",
      });
    }

    const positions = await getPositions(access_token);
    return positions;
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Внутренняя ошибка сервера",
    });
  }
});
