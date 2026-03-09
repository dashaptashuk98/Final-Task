export const skillsQuery = gql`
  query GetSkills {
    skills {
      id
      created_at
      name
      category {
        id
        name
        parent {
          id
          name
        }
      }
      category_name
      category_parent_name
    }
  }
`;
