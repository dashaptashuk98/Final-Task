export const usersQuery = gql`
  query {
    users {
      id
      created_at
      email
      role
      is_verified
      profile {
        first_name
        last_name
        full_name
        avatar
      }
      department {
        name
      }
      position {
        name
      }
    }
  }
`;
export const userQuery = gql`
  query ($userId: ID!) {
    user(userId: $userId) {
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
  }
`;
