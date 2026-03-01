import axios from "axios";
import type { GraphQLResponse, SecureSessionData } from "../../types/auth";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { refresh_token } = body;

    if (!refresh_token) {
      throw createError({
        statusCode: 400,
        message: "Refresh token не предоставлен",
      });
    }

    const GRAPHQL_URL = process.env.VITE_GRAPHQL_URL || "http://localhost:3001/api/graphql";

    interface UpdateTokenResponse {
      updateToken: SecureSessionData;
    }

    const graphqlResponse = await axios.post<GraphQLResponse<UpdateTokenResponse>>(
      GRAPHQL_URL,
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
          Authorization: `Bearer ${refresh_token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const { data, errors } = graphqlResponse.data;

    if (errors) {
      throw createError({
        statusCode: 401,
        message: errors[0]?.message || "Не удалось обновить токен",
      });
    }

    if (data?.updateToken) {
      const session = await getUserSession(event);
      if (session?.user) {
        await setUserSession(event, {
          user: session.user,
          secure: {
            access_token: data.updateToken.access_token,
            refresh_token: data.updateToken.refresh_token,
          },
        });
      }
      return {
        success: true,
        updateToken: data.updateToken,
      };
    }

    throw createError({
      statusCode: 401,
      message: "Не удалось обновить токен",
    });
  } catch (error: unknown) {
    let statusCode = 500;
    let message = "Ошибка при обновлении токена";

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { status?: number; data?: { errors?: Array<{ message?: string }> } };
      };
      statusCode = axiosError.response?.status || 500;
      message = axiosError.response?.data?.errors?.[0]?.message || message;
    } else if (error && typeof error === "object" && "message" in error) {
      const standardError = error as { message?: string };
      message = standardError.message || message;
    }
    throw createError({
      statusCode,
      message,
    });
  }
});
