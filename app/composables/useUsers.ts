import type { Department } from "~/types/departments";
import type { Position } from "~/types/positions";
import type { UserSkill, Skill } from "~/types/skills";
import type { SkillCategory } from "~/types/skillCategory";
import type { CreateProfileInput, Profile, UpdateUserInput, User } from "~/types/user";
import type { Nullable } from "~/types/types";
import { profileQuery, userQuery, usersQuery } from "~/graphQL/user/user.query";
import { departmentsQuery } from "~/graphQL/departments/departments.query";
import { positionsQuery } from "~/graphQL/positions/positions.query";
import { userSkillsQuery } from "~/graphQL/skills/skillsUsers.query";
import { skillCategoryQuery } from "~/graphQL/skills/skillsCategory.query";
import { skillsQuery } from "~/graphQL/skills/skill.query";
import type { Language, LanguageQueryVars, LanguageQueryVarsExt } from "~/types/languages";
import { languagesQuery } from "~/graphQL/languages/languages.query";
import {
  addProfileLanguageMutation,
  deleteProfileLanguageMutation,
  updateProfileLanguageMutation,
} from "~/graphQL/languages/languages.mutation";
import {
  createUserMutation,
  deleteUserMutation,
  updateUserMutation,
} from "~/graphQL/user/user.mutation";

export const useUsers = () => {
  const { clients } = useApollo();
  const user = useState<Nullable<User>>("user", () => null);
  const departments = useState<Nullable<Department[]>>("departments", () => []);
  const skillCategories = useState<Nullable<SkillCategory[]>>("skillCategories", () => []);
  const positions = useState<Position[]>("positions", () => []);
  const users = useState<User[]>("users", () => []);
  const skills = useState<Nullable<Skill[]>>("skills", () => []);
  const userSkills = useState<Nullable<UserSkill[]>>("userSkills", () => []);

  const isLoading = ref<boolean>(false);
  const mutationLoading = ref<boolean>(false);

  const getUser = computed<Nullable<User>>(() => user.value);
  const getUsers = computed<User[]>(() => users.value);
  const getUserSkills = computed<Nullable<UserSkill[]>>(() => userSkills.value);

  const getUserById = (id: string): ComputedRef<Nullable<User>> =>
    computed(() => users.value.find((u) => u.id === id) ?? null);

  const fetchUser = async (userId: string): Promise<Nullable<User>> => {
    if (clients) {
      const { data } = await clients.default.query({
        query: userQuery,
        variables: { userId: userId },
        fetchPolicy: "network-only",
      });
      if (data) {
        user.value = data.user;
        return data.user;
      }
    }
    return null;
  };

  const fetchDepartments = async (): Promise<Nullable<Department[]>> => {
    try {
      const { data } = await useAsyncQuery<Record<"departments", Department[]>>(departmentsQuery);
      if (data.value) {
        departments.value = data.value.departments;
        return data.value.departments;
      }
      return null;
    } catch {
      return null;
    }
  };

  const fetchSkills = async (): Promise<Nullable<Skill[]>> => {
    try {
      const { data } = await useAsyncQuery<Record<"skills", Skill[]>>(skillsQuery);
      if (data.value) {
        skills.value = data.value.skills;
        return data.value.skills;
      }
      return null;
    } catch {
      return null;
    }
  };

  const fetchUserSkills = async (userId: string): Promise<Nullable<UserSkill[]>> => {
    try {
      const { data } = await useAsyncQuery<Record<"user", { profile: { skills: UserSkill[] } }>>(
        userSkillsQuery,
        { userId },
      );

      if (data.value?.user?.profile?.skills) {
        userSkills.value = data.value.user.profile.skills;
        return data.value.user.profile.skills;
      }
      return null;
    } catch {
      return null;
    }
  };

  const fetchSkillCategories = async (): Promise<Nullable<SkillCategory[]>> => {
    try {
      const { data } =
        await useAsyncQuery<Record<"skillCategories", SkillCategory[]>>(skillCategoryQuery);

      if (data.value?.skillCategories) {
        skillCategories.value = data.value.skillCategories;
        return data.value.skillCategories;
      }
      return null;
    } catch {
      return null;
    }
  };

  const fetchPositions = async (): Promise<Nullable<Position[]>> => {
    try {
      const { data } = await useAsyncQuery<Record<"positions", Position[]>>(positionsQuery);
      if (data.value) {
        positions.value = data.value.positions;
        return data.value.positions;
      }
      return null;
    } catch {
      return null;
    }
  };

  const fetchUsers = async (): Promise<Nullable<User[]>> => {
    isLoading.value = true;
    if (clients) {
      const { data } = await clients.default.query({
        query: usersQuery,
        fetchPolicy: "no-cache",
      });
      if (data) {
        users.value = data.users;
        return data.users;
      }
    }
    return null;
  };

  const fetchProfile = async (userId: string): Promise<Nullable<Profile>> => {
    isLoading.value = true;
    try {
      const { data } = await useAsyncQuery<Record<"profile", Profile>>(profileQuery, { userId });
      if (data.value) {
        return data.value.profile;
      }
      return null;
    } catch {
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchLanguages = async (): Promise<Nullable<Language[]>> => {
    isLoading.value = true;
    try {
      const { data } = await useAsyncQuery<Record<"languages", Language[]>>(languagesQuery);
      if (data.value) {
        return data.value.languages;
      }
      return null;
    } catch {
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const addProfileLanguage = async (language: LanguageQueryVarsExt): Promise<Nullable<Profile>> => {
    if (clients) {
      const { data } = await clients.default.mutate<Record<"addProfileLanguage", Profile>>({
        mutation: addProfileLanguageMutation,
        variables: { language: language },
      });
      if (data) {
        return data.addProfileLanguage;
      }
    }
    return null;
  };

  const updateProfileLanguage = async (
    language: LanguageQueryVarsExt,
  ): Promise<Nullable<Profile>> => {
    if (clients) {
      const { data } = await clients.default.mutate<Record<"updateProfileLanguage", Profile>>({
        mutation: updateProfileLanguageMutation,
        variables: { language: language },
      });
      if (data) {
        return data.updateProfileLanguage;
      }
    }
    return null;
  };

  const deleteProfileLanguage = async (language: LanguageQueryVars): Promise<Nullable<Profile>> => {
    if (clients) {
      const { data } = await clients.default.mutate<Record<"deleteProfileLanguage", Profile>>({
        mutation: deleteProfileLanguageMutation,
        variables: { language: language },
      });
      if (data) {
        return data.deleteProfileLanguage;
      }
    }
    return null;
  };

  const deleteUser = async (id: string): Promise<Nullable<User>> => {
    if (clients) {
      const { data } = await clients.default.mutate({
        mutation: deleteUserMutation,
        variables: { userId: id },
      });
      if (data) {
        return data.user;
      }
    }
    return null;
  };

  const updateUser = async (user: UpdateUserInput): Promise<Nullable<User>> => {
    if (clients) {
      const { data } = await clients.default.mutate({
        mutation: updateUserMutation,
        variables: { user: user },
      });
      if (data) {
        return data.user;
      }
    }
    return null;
  };

  const createUser = async (user: CreateProfileInput): Promise<Nullable<User>> => {
    if (clients) {
      const { data } = await clients.default.mutate({
        mutation: createUserMutation,
        variables: { user: user },
      });
      if (data) {
        return data.user;
      }
    }
    return null;
  };

  const clearUsers = (): void => {
    users.value = [];
  };

  return {
    user,
    departments,
    positions,
    users,
    skills,
    skillCategories,
    userSkills,
    loading: isLoading,
    mutationLoading,

    getUser,
    getUsers,
    getUserById,
    getUserSkills,

    fetchUser,
    fetchDepartments,
    fetchPositions,
    fetchUserSkills,
    fetchSkillCategories,
    fetchSkills,
    fetchUsers,
    fetchProfile,
    fetchLanguages,
    addProfileLanguage,
    updateProfileLanguage,
    deleteProfileLanguage,
    clearUsers,
    deleteUser,
    updateUser,
    createUser,
  };
};
