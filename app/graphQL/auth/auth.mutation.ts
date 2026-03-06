import type { LoginCredentials } from "~/types/auth";

export const updateTokenMutation: LoginCredentials = gql`
  mutation UpdateToken {
    updateToken {
      access_token
      refresh_token
    }
  }
`;
