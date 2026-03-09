export const userSkillsQuery = gql`
  query GetUserSkills($userId: ID!) {
    user(userId: $userId) {
      id
      profile {
        id
        skills {
          name
          categoryId
          mastery
        }
      }
    }
  }
`;
