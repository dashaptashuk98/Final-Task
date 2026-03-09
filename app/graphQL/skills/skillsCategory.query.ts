export const skillCategoryQuery = gql`
  query GetSkillCategories {
    skillCategories {
      id
      name
      order
      parent {
        id
        name
        order
      }
    }
  }
`;
