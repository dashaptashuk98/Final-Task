import { graphqlClient } from "../utils/graphqlClient";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { email, password } = body;

    const graphqlResponse = await graphqlClient.post("", {
      query: `
        query Login($auth: AuthInput!) {
          login(auth: $auth) {
            user {
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
            access_token
            refresh_token
          }
        }
      `,
      variables: {
        auth: {
          email: email,
          password: password,
        },
      },
    });

    const { data, errors } = graphqlResponse.data;

    if (errors && errors.length > 0) {
      throw createError({
        statusCode: 401,
        message: errors[0]?.message || "Неверный email или пароль",
      });
    }

    if (data?.login?.user) {
      const { user, access_token, refresh_token } = data.login;

      await setUserSession(event, {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          is_verified: user.is_verified,
          profile: user.profile,
          department: user.department,
          position: user.position,
        },
        secure: {
          access_token,
          refresh_token,
        },
      });

      return {
        success: true,
        user,
      };
    }

    throw createError({
      statusCode: 401,
      message: "Неверный email или пароль",
    });
  } catch (error) {
    // Приводим error к нужному типу
    const err = error as { statusCode?: number; message?: string };

    throw createError({
      statusCode: err.statusCode || 500,
      message: err.message || "Ошибка при авторизации",
    });
  }
});
