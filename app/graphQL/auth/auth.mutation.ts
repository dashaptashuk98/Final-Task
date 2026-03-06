export const updateTokenMutation = gql`
  mutation UpdateToken {
    updateToken {
      access_token
      refresh_token
    }
  }
`;
