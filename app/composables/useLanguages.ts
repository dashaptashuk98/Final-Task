import {
  createLanguageMutation,
  deleteLanguageMutation,
  updateLanguageMutation,
} from "~/graphQL/languages/languages.mutation";
import { languagesQuery } from "~/graphQL/languages/languages.query";
import type {
  createLanguageInput,
  deleteLanguageInput,
  Language,
  updateLanguageInput,
} from "~/types/languages";
import type { Nullable } from "~/types/types";

export const useLanguages = () => {
  const { clients } = useApollo();
  const fetchLanguages = async (): Promise<Nullable<Language[]>> => {
    if (clients) {
      const { data } = await clients.default.query({
        query: languagesQuery,
        fetchPolicy: "no-cache",
      });
      if (data) {
        return data.languages;
      }
    }
    return null;
  };
  const createLanguage = async (language: createLanguageInput): Promise<Nullable<Language>> => {
    if (clients) {
      const { data } = await clients.default.mutate({
        mutation: createLanguageMutation,
        variables: { language: language },
      });
      if (data) {
        return data.createPosition;
      }
    }
    return null;
  };
  const updateLanguage = async (language: updateLanguageInput): Promise<Nullable<Language>> => {
    if (clients) {
      const { data } = await clients.default.mutate({
        mutation: updateLanguageMutation,
        variables: { language: language },
      });
      if (data) {
        return data.updatePosition;
      }
    }
    return null;
  };
  const deleteLanguage = async (languageId: deleteLanguageInput): Promise<Nullable<Language>> => {
    if (clients) {
      const { data } = await clients.default.mutate({
        mutation: deleteLanguageMutation,
        variables: { language: languageId },
      });
      if (data) {
        return data.deletePosition;
      }
    }
    return null;
  };
  return { fetchLanguages, createLanguage, updateLanguage, deleteLanguage };
};
