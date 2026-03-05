export const loginQuery = gql`
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
        department_name
        position_name
        role
      }
      access_token
      refresh_token
    }
  }
`;
