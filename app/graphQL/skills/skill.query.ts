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

export const createSkillMutation = gql`
  mutation createSkill($skill: CreateSkillInput!) {
    createSkill(skill: $skill) {
      id
      created_at
      name
      category {
        id
        name
      }
      category_name
      category_parent_name
    }
  }
`;

export const updateSkillMutation = gql`
  mutation updateSkill($skill: UpdateSkillInput!) {
    updateSkill(skill: $skill) {
      id
      created_at
      name
      category {
        id
        name
      }
      category_name
      category_parent_name
    }
  }
`;

export const deleteSkillMutation = gql`
  mutation deleteSkill($skill: DeleteSkillInput!) {
    deleteSkill(skill: $skill) {
      affected
    }
  }
`;
