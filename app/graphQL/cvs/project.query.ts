export const getProjects = gql`
  query GetAllProjects {
    projects {
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
  }
`;

export const addProject = gql`
  mutation addCvProject($project: AddCvProjectInput!) {
    addCvProject(project: $project) {
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

export const deleteProject = gql`
  mutation RemoveCvProject($cvId: ID!, $projectId: ID!) {
    removeCvProject(project: { cvId: $cvId, projectId: $projectId }) {
      id
      projects {
        id
        name
      }
    }
  }
`;
