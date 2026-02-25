import api from "./api";

export interface User {
  id: string;
  email: string;
  role?: string;
  is_verified?: boolean;
  profile?: {
    first_name: string;
    last_name: string;
    full_name: string;
  };
  department?: {
    name: string;
  };
  position?: {
    name: string;
  };
}

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
