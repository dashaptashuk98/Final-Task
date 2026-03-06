export const positionsQuery = gql`
  query {
    positions {
      id
      created_at
      name
    }
  }
`;
