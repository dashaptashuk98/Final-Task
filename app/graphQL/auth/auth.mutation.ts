export const updateTokenMutation = gql`
  mutation UpdateToken {
    updateToken {
      access_token
      refresh_token
    }
  }
`;

export const signupMutation = gql`
  mutation signup($auth: AuthInput!) {
    signup(auth: $auth) {
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
