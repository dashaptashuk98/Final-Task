export const getProjects = gql`
  query GetAllProjects {
    projects {
      id
      created_at
      name
      internal_name
      domain
      start_date
      end_date
      description
      environment
    }
  }
`;
