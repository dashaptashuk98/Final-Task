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

export const updateCvProjects = gql`
  mutation UpdateCvProjects(
    $cvId: ID!
    $currentName: String!
    $currentDescription: String!
    $currentEducation: String
    $projects: [CvProjectInput!]!
  ) {
    updateCv(
      cv: {
        cvId: $cvId
        name: $currentName
        description: $currentDescription
        education: $currentEducation
        projects: $projects
      }
    ) {
      id
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
        }
      }
    }
  }
`;
