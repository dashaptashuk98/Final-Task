export const updateCvMutation = gql`
  mutation updateCv($cv: UpdateCvInput!) {
    updateCv(cv: $cv) {
      id
      name
      education
      description
    }
  }
`;

export const updateCvProject = gql`
  mutation UpdateCvProject($project: UpdateCvProjectInput!) {
    updateCvProject(project: $project) {
`;
export const deleteCvMutation = gql`
  mutation deleteCv($cv: DeleteCvInput!) {
    deleteCv(cv: $cv) {
      affected
    }
  }
`;
export const createCvMutation = gql`
  mutation createCv($cv: CreateCvInput!) {
    createCv(cv: $cv) {
      id
      created_at
      name
      education
      description
      projects {
        id
        name
        internal_name
        description
        domain
        start_date
        end_date
        environment
        roles
        responsibilities
        project {
          id
          name
          internal_name
          domain
          start_date
          end_date
          description
          environment
        }
      }
    }
  }
`;

export const AddSkillMutation = gql`
  mutation AddCvSkill($skill: AddCvSkillInput!) {
    addCvSkill(skill: $skill) {
      id
      created_at
      name
      education
      description
      user {
        id
        created_at
        email
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

export const updateCvSkillMutation = gql`
  mutation UpdateCvSkill($skill: UpdateCvSkillInput!) {
    updateCvSkill(skill: $skill) {
      id
      created_at
      name
      education
      description
      user {
        id
        created_at
        email
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
      skills {
        name
        categoryId
        mastery
      }
      projects {
        id
        name
        roles
        responsibilities
      }
      languages {
        name
        proficiency
      }
    }
  }
`;

export const deleteCvSkillMutation = gql`
  mutation DeleteCvSkill($skill: DeleteCvSkillInput!) {
    deleteCvSkill(skill: $skill) {
      id
      name
      education
      description
      skills {
        name
        categoryId
        mastery
      }
      projects {
        id
        name
        roles
        responsibilities
      }
      languages {
        name
        proficiency
      }
    }
  }
`;
