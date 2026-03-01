import type { Department } from "~~/types/departments";
import { getDepartments } from "../services/departments";

export default defineEventHandler(async (event): Promise<Department[]> => {
  if (!event) {
    throw createError({
      statusCode: 400,
      statusMessage: "Error",
    });
  }
  return await getDepartments();
});
