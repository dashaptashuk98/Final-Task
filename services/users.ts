import api from "./api";
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
