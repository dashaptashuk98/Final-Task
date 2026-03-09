export const updateSkillMutation = gql`
  mutation UpdateProfileSkill($skill: UpdateProfileSkillInput!) {
    updateProfileSkill(skill: $skill) {
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
