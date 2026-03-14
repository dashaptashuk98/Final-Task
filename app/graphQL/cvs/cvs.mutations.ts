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
export const deleteCvMutation = gql`
  mutation deleteCv($cv: DeleteCvInput!) {
    deleteCv(cv: $cv) {
      affected
    }
  }
`;
