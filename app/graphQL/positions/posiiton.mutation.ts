export const createPositionMutation = gql`
  mutation createPosition($position: CreatePositionInput!) {
    createPosition(position: $position) {
      id
      created_at
      name
    }
  }
`;

export const updatePositionMutation = gql`
  mutation updatePosition($position: UpdatePositionInput!) {
    updatePosition(position: $position) {
      id
      created_at
      name
    }
  }
`;

export const deletePositionMutation = gql`
  mutation deletePosition($position: DeletePositionInput!) {
    deletePosition(position: $position) {
      affected
    }
  }
`;
