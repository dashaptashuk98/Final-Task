import api from "../utils/api";
import type { User } from "../../types/user";
export const getUsers = async () => {
  const response = await api.post("", {
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
  });

  if (response.data.errors) {
    throw new Error(response.data.errors[0].message);
  }

  return response.data.data?.users || [];
};

export const getUser = async (userId: string): Promise<User> => {
  const response: { data: { data: { user: User } } } = await api.post("", {
    query: `
      query($userId: ID!) {
        user(userId: $userId) {
          id
          created_at
          email
          profile {
              id
              created_at
              first_name
              last_name
              full_name
              avatar
              skills {
                name
                categoryId
                mastery
              }
              languages {
                  name
                  proficiency
              }
          }
          department {
            id
            created_at
            name
          }
          department_name
          position {
            id
            created_at
            name
          }
          position_name
          role
        }
      }`,
    variables: {
      userId,
    },
  });
  return response.data.data.user;
};
