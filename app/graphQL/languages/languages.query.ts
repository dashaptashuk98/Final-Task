export const languagesQuery = gql`
  query {
    languages {
      id
      created_at
      iso2
      name
      native_name
    }
  }
`;
