import { graphqlClient } from "../../utils/graphqlClient";
import type {
  Session,
  UsersResponse,
  GraphQLResponse,
  UpdateTokenResponse,
} from "../../../types/auth";
import type { User, UserUI } from "../../../types/user";

export default defineEventHandler(async (event) => {
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

    async function executeRequest(token: string) {
      return await graphqlClient.post<GraphQLResponse<UsersResponse>>(
        "",
        {
          query: `
            query {
              users {
                id
                email
                role
                is_verified
                profile {
                  first_name
                  last_name
                  full_name
                  avatar
                }
                department {
                  name
                }
                position {
                  name
                }
              }
            }
          `,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    }

    let response = await executeRequest(access_token);

    const needsRefresh = response.data.errors?.some(
      (e) =>
        e.message?.includes("Unauthorized") ||
        e.message?.includes("Not authenticated") ||
        e.message?.includes("invalid token"),
    );

    if (needsRefresh && session.secure?.refresh_token) {
      try {
        const refreshResponse = await graphqlClient.post<GraphQLResponse<UpdateTokenResponse>>(
          "",
          {
            query: `
              mutation UpdateToken {
                updateToken {
                  access_token
                  refresh_token
                }
              }
            `,
          },
          {
            headers: {
              Authorization: `Bearer ${session.secure.refresh_token}`,
            },
          },
        );

        const { data, errors } = refreshResponse.data;

        if (errors) {
          throw new Error(`Не удалось обновить токен: ${errors[0]?.message}`);
        }

        if (data?.updateToken) {
          const { access_token: newToken, refresh_token: newRefreshToken } = data.updateToken;

          await setUserSession(event, {
            user: session.user,
            secure: {
              access_token: newToken,
              refresh_token: newRefreshToken,
            },
          });

          response = await executeRequest(newToken);
        } else {
          throw new Error("Нет данных updateToken в ответе");
        }
      } catch {
        await clearUserSession(event);
        throw createError({
          statusCode: 401,
          statusMessage: "Unauthorized",
          message: "Сессия истекла. Пожалуйста, войдите снова.",
        });
      }
    }

    const { data, errors } = response.data;

    if (errors && errors.length > 0) {
      const firstError = errors[0];
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: firstError?.message || "Ошибка GraphQL",
      });
    }

    if (!data?.users) {
      return [];
    }

    const users: UserUI[] = data.users.map((user: User) => ({
      id: user.id,
      firstName: user.profile?.first_name || "",
      lastName: user.profile?.last_name || "",
      fullName:
        user.profile?.full_name ||
        [user.profile?.first_name, user.profile?.last_name].filter(Boolean).join(" ").trim(),
      email: user.email,
      department: user.department?.name || "",
      position: user.position?.name || "",
      avatar: user.profile?.avatar || null,
      role: user.role || "user",
      isVerified: user.is_verified || false,
    }));

    return users;
  } catch (error: unknown) {
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
