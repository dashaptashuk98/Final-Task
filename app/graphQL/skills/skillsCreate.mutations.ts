export const createSkillMutation = gql`
  mutation AddProfileSkill($skill: AddProfileSkillInput!) {
    addProfileSkill(skill: $skill) {
      id
      first_name
      last_name
      full_name
      skills {
        name
        categoryId
        mastery
      }
    }
  }
`;

export const createSkillMutationAdmin = gql`
  mutation CreateSkill($skill: CreateSkillInput!) {
    createSkill(skill: $skill) {
      id
      created_at
      name
      category {
        id
        name
        order
        parent {
          id
          name
        }
        children {
          id
          name
        }
      }
      category_name
      category_parent_name
    }
  }
`;
