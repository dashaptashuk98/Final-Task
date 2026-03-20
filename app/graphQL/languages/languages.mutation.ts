export const addProfileLanguageMutation = gql`
  mutation addProfileLanguage($language: AddProfileLanguageInput!) {
    addProfileLanguage(language: $language) {
      id
      created_at
      first_name
      last_name
      full_name
      avatar
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

export const updateProfileLanguageMutation = gql`
  mutation updateProfileLanguage($language: UpdateProfileLanguageInput!) {
    updateProfileLanguage(language: $language) {
      id
      created_at
      first_name
      last_name
      full_name
      avatar
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

export const deleteProfileLanguageMutation = gql`
  mutation deleteProfileLanguage($language: DeleteProfileLanguageInput!) {
    deleteProfileLanguage(language: $language) {
      id
      created_at
      first_name
      last_name
      full_name
      avatar
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

export const updateLanguageMutation = gql`
  mutation updateLanguage($language: UpdateLanguageInput!) {
    updateLanguage(language: $language) {
      id
      created_at
      iso2
      name
      native_name
    }
  }
`;
export const createLanguageMutation = gql`
  mutation createLanguage($language: CreateLanguageInput!) {
    createLanguage(language: $language) {
      id
      created_at
      iso2
      name
      native_name
    }
  }
`;
export const deleteLanguageMutation = gql`
  mutation deleteLanguage($language: DeleteLanguageInput!) {
    deleteLanguage(language: $language) {
      affected
    }
  }
`;
