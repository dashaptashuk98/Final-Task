export const departmentsQuery = gql`
  query {
    departments {
      id
      created_at
      name
    }
  }
`;
