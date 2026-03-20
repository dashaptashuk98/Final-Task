import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { useUsers } from "@/composables/useUsers";

const { mockQuery, mockMutate, mockUseAsyncQuery } = vi.hoisted(() => ({
  mockQuery: vi.fn(),
  mockMutate: vi.fn(),
  mockUseAsyncQuery: vi.fn(),
}));

mockNuxtImport("useApollo", () => () => ({
  clients: { default: { query: mockQuery, mutate: mockMutate } },
}));
mockNuxtImport("useAsyncQuery", () => mockUseAsyncQuery);

vi.mock("@/graphQL/user/user.query", () => ({
  userQuery: "userQuery",
  usersQuery: "usersQuery",
  profileQuery: "profileQuery",
}));
vi.mock("@/graphQL/departments/departments.query", () => ({
  departmentsQuery: "departmentsQuery",
}));
vi.mock("@/graphQL/positions/positions.query", () => ({ positionsQuery: "positionsQuery" }));
vi.mock("@/graphQL/skills/skillsUsers.query", () => ({ userSkillsQuery: "userSkillsQuery" }));
vi.mock("@/graphQL/skills/skillsCategory.query", () => ({
  skillCategoryQuery: "skillCategoryQuery",
}));
vi.mock("@/graphQL/skills/skill.query", () => ({ skillsQuery: "skillsQuery" }));
vi.mock("@/graphQL/languages/languages.query", () => ({ languagesQuery: "languagesQuery" }));
vi.mock("@/graphQL/languages/languages.mutation", () => ({
  addProfileLanguageMutation: "addProfileLanguageMutation",
  deleteProfileLanguageMutation: "deleteProfileLanguageMutation",
  updateProfileLanguageMutation: "updateProfileLanguageMutation",
}));
vi.mock("@/graphQL/user/user.mutation", () => ({
  createUserMutation: "createUserMutation",
  deleteUserMutation: "deleteUserMutation",
  updateUserMutation: "updateUserMutation",
}));

describe("useUsers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("computed properties", () => {
    it("getUser returns current user", () => {
      const { getUser, user } = useUsers();
      user.value = { id: "1", email: "a@a.com" };
      expect(getUser.value).toEqual({ id: "1", email: "a@a.com" });
    });

    it("getUsers returns users array", () => {
      const { getUsers, users } = useUsers();
      users.value = [{ id: "1" }, { id: "2" }];
      expect(getUsers.value).toHaveLength(2);
    });

    it("getUserById returns correct user", () => {
      const { getUserById, users } = useUsers();
      users.value = [
        { id: "1", email: "a@a.com" },
        { id: "2", email: "b@b.com" },
      ];
      expect(getUserById("1").value).toEqual({ id: "1", email: "a@a.com" });
    });

    it("getUserById returns null when not found", () => {
      const { getUserById, users } = useUsers();
      users.value = [];
      expect(getUserById("999").value).toBeNull();
    });
  });

  describe("fetchUser", () => {
    it("returns user and sets state", async () => {
      mockQuery.mockResolvedValue({ data: { user: { id: "1", email: "a@a.com" } } });
      const { fetchUser, user } = useUsers();
      const result = await fetchUser("1");
      expect(result).toEqual({ id: "1", email: "a@a.com" });
      expect(user.value).toEqual({ id: "1", email: "a@a.com" });
    });

    it("returns null when no data", async () => {
      mockQuery.mockResolvedValue({ data: null });
      const { fetchUser } = useUsers();
      expect(await fetchUser("1")).toBeNull();
    });
  });

  describe("fetchUsers", () => {
    it("returns users and sets state", async () => {
      mockQuery.mockResolvedValue({ data: { users: [{ id: "1" }, { id: "2" }] } });
      const { fetchUsers, users } = useUsers();
      const result = await fetchUsers();
      expect(result).toHaveLength(2);
      expect(users.value).toHaveLength(2);
    });

    it("returns null when no data", async () => {
      mockQuery.mockResolvedValue({ data: null });
      const { fetchUsers } = useUsers();
      expect(await fetchUsers()).toBeNull();
    });
  });

  describe("fetchDepartments", () => {
    it("returns departments and sets state", async () => {
      mockUseAsyncQuery.mockReturnValue({
        data: { value: { departments: [{ id: "1", name: "HR" }] } },
      });
      const { fetchDepartments, departments } = useUsers();
      const result = await fetchDepartments();
      expect(result).toEqual([{ id: "1", name: "HR" }]);
      expect(departments.value).toEqual([{ id: "1", name: "HR" }]);
    });

    it("returns null when no data", async () => {
      mockUseAsyncQuery.mockReturnValue({ data: { value: null } });
      const { fetchDepartments } = useUsers();
      expect(await fetchDepartments()).toBeNull();
    });

    it("returns null on error", async () => {
      mockUseAsyncQuery.mockRejectedValue(new Error("fail"));
      const { fetchDepartments } = useUsers();
      expect(await fetchDepartments()).toBeNull();
    });
  });

  describe("fetchPositions", () => {
    it("returns positions and sets state", async () => {
      mockUseAsyncQuery.mockReturnValue({
        data: { value: { positions: [{ id: "1", name: "Dev" }] } },
      });
      const { fetchPositions, positions } = useUsers();
      const result = await fetchPositions();
      expect(result).toEqual([{ id: "1", name: "Dev" }]);
      expect(positions.value).toEqual([{ id: "1", name: "Dev" }]);
    });

    it("returns null when no data", async () => {
      mockUseAsyncQuery.mockReturnValue({ data: { value: null } });
      const { fetchPositions } = useUsers();
      expect(await fetchPositions()).toBeNull();
    });
  });

  describe("fetchSkills", () => {
    it("returns skills and sets state", async () => {
      mockUseAsyncQuery.mockReturnValue({ data: { value: { skills: [{ id: "1", name: "JS" }] } } });
      const { fetchSkills, skills } = useUsers();
      const result = await fetchSkills();
      expect(result).toEqual([{ id: "1", name: "JS" }]);
      expect(skills.value).toEqual([{ id: "1", name: "JS" }]);
    });

    it("returns null when no data", async () => {
      mockUseAsyncQuery.mockReturnValue({ data: { value: null } });
      const { fetchSkills } = useUsers();
      expect(await fetchSkills()).toBeNull();
    });
  });

  describe("fetchUserSkills", () => {
    it("returns user skills and sets state", async () => {
      const mockSkills = [{ skillId: "1", mastery: "Novice" }];
      mockUseAsyncQuery.mockReturnValue({
        data: { value: { user: { profile: { skills: mockSkills } } } },
      });
      const { fetchUserSkills, userSkills } = useUsers();
      const result = await fetchUserSkills("1");
      expect(result).toEqual(mockSkills);
      expect(userSkills.value).toEqual(mockSkills);
    });

    it("returns null when no skills", async () => {
      mockUseAsyncQuery.mockReturnValue({ data: { value: null } });
      const { fetchUserSkills } = useUsers();
      expect(await fetchUserSkills("1")).toBeNull();
    });
  });

  describe("fetchSkillCategories", () => {
    it("returns skill categories and sets state", async () => {
      const mockCategories = [{ id: "1", name: "Frontend" }];
      mockUseAsyncQuery.mockReturnValue({ data: { value: { skillCategories: mockCategories } } });
      const { fetchSkillCategories, skillCategories } = useUsers();
      const result = await fetchSkillCategories();
      expect(result).toEqual(mockCategories);
      expect(skillCategories.value).toEqual(mockCategories);
    });

    it("returns null when no data", async () => {
      mockUseAsyncQuery.mockReturnValue({ data: { value: null } });
      const { fetchSkillCategories } = useUsers();
      expect(await fetchSkillCategories()).toBeNull();
    });
  });

  describe("fetchProfile", () => {
    it("returns profile", async () => {
      mockUseAsyncQuery.mockReturnValue({ data: { value: { profile: { id: "1", skills: [] } } } });
      const { fetchProfile } = useUsers();
      const result = await fetchProfile("1");
      expect(result).toEqual({ id: "1", skills: [] });
    });

    it("returns null when no data", async () => {
      mockUseAsyncQuery.mockReturnValue({ data: { value: null } });
      const { fetchProfile } = useUsers();
      expect(await fetchProfile("1")).toBeNull();
    });

    it("returns null on error", async () => {
      mockUseAsyncQuery.mockRejectedValue(new Error("fail"));
      const { fetchProfile } = useUsers();
      expect(await fetchProfile("1")).toBeNull();
    });
  });

  describe("fetchLanguages", () => {
    it("returns languages", async () => {
      mockUseAsyncQuery.mockReturnValue({
        data: { value: { languages: [{ id: "1", name: "English" }] } },
      });
      const { fetchLanguages } = useUsers();
      expect(await fetchLanguages()).toEqual([{ id: "1", name: "English" }]);
    });

    it("returns null when no data", async () => {
      mockUseAsyncQuery.mockReturnValue({ data: { value: null } });
      const { fetchLanguages } = useUsers();
      expect(await fetchLanguages()).toBeNull();
    });
  });

  describe("mutations", () => {
    it("deleteUser returns user", async () => {
      mockMutate.mockResolvedValue({ data: { user: { id: "1" } } });
      const { deleteUser } = useUsers();
      expect(await deleteUser("1")).toEqual({ id: "1" });
    });

    it("deleteUser returns null when no data", async () => {
      mockMutate.mockResolvedValue({ data: null });
      const { deleteUser } = useUsers();
      expect(await deleteUser("1")).toBeNull();
    });

    it("updateUser returns user", async () => {
      mockMutate.mockResolvedValue({ data: { user: { id: "1", email: "new@a.com" } } });
      const { updateUser } = useUsers();
      expect(await updateUser({ userId: "1" })).toEqual({ id: "1", email: "new@a.com" });
    });

    it("createUser returns user", async () => {
      mockMutate.mockResolvedValue({ data: { user: { id: "2", email: "new@b.com" } } });
      const { createUser } = useUsers();
      expect(await createUser({ email: "new@b.com" })).toEqual({ id: "2", email: "new@b.com" });
    });

    it("addProfileLanguage returns profile", async () => {
      mockMutate.mockResolvedValue({ data: { addProfileLanguage: { id: "1" } } });
      const { addProfileLanguage } = useUsers();
      expect(await addProfileLanguage({ language: "en" })).toEqual({ id: "1" });
    });

    it("updateProfileLanguage returns profile", async () => {
      mockMutate.mockResolvedValue({ data: { updateProfileLanguage: { id: "1" } } });
      const { updateProfileLanguage } = useUsers();
      expect(await updateProfileLanguage({ language: "en" })).toEqual({ id: "1" });
    });

    it("deleteProfileLanguage returns profile", async () => {
      mockMutate.mockResolvedValue({ data: { deleteProfileLanguage: { id: "1" } } });
      const { deleteProfileLanguage } = useUsers();
      expect(await deleteProfileLanguage({ language: "en" })).toEqual({ id: "1" });
    });
  });

  describe("clearUsers", () => {
    it("clears users array", () => {
      const { clearUsers, users } = useUsers();
      users.value = [{ id: "1" }];
      clearUsers();
      expect(users.value).toEqual([]);
    });
  });
});
