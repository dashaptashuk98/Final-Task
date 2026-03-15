export const cvQuery = gql`
  query cv($cvId: ID!) {
    cv(cvId: $cvId) {
      id
      created_at
      name
      education
      description
      user {
        id
        created_at
        email
        profile {
          id
          created_at
          first_name
          last_name
          full_name
          avatar
        }
        department {
          id
          created_at
          name
        }
        department_name
        position {
          id
          created_at
          name
        }
        position_name
        role
      }
      projects {
        id
        project {
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
        name
        internal_name
        description
        domain
        start_date
        end_date
        environment
        roles
        responsibilities
      }
      skills {
        name
        categoryId
        mastery
      }
      languages {
        name
        proficiency
      }
    }
  }
`;
