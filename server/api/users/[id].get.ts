import type { User } from "~~/types/user";
import { getUser } from "../../services/users";

export default defineEventHandler(async (event): Promise<User> => {
  const userId = getRouterParam(event, "id");

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "User ID required",
    });
  }
  return await getUser(userId);
});
