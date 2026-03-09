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
