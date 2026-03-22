export const updateProjectMutation = gql`
  mutation updateProject($project: UpdateProjectInput!) {
    updateProject(project: $project) {
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
export const deleteProjectMutation = gql`
  mutation deleteProject($project: DeleteProjectInput!) {
    deleteProject(project: $project) {
      affected
    }
  }
`;

export const createProjectMutation = gql`
  mutation createProject($project: CreateProjectInput!) {
    createProject(project: $project) {
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
