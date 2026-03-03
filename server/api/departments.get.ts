import type { Department } from "~/types/departments";
import { getDepartments } from "../services/departments";
import type { Session } from "~/types/auth";

export default defineEventHandler(async (event): Promise<Department[]> => {
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

    const departments = await getDepartments(access_token);
    return departments;
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
