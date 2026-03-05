import type { Department } from "~/types/departments";
import type { Position } from "~/types/positions";
import type { User, UserResponse } from "~/types/user";
import type { Nullable } from "~/types/types";
import { userQuery, usersQuery } from "~/graphQL/users/users.query";
import { departmentsQuery } from "~/graphQL/departments/departments.query";
import { positionsQuery } from "~/graphQL/positions/positions.query";

export const useUsers = () => {
  const user = useState<Nullable<User>>("user", () => null);
  const departments = useState<Nullable<Department[]>>("departments", () => []);
  const positions = useState<Position[]>("positions", () => []);
  const users = useState<User[]>("users", () => []);

  const loading = ref(false);

  const getUser = computed<Nullable<User>>(() => user.value);
  const getUsers = computed<User[]>(() => users.value);

  const getUserById = (id: string): ComputedRef<Nullable<User>> =>
    computed(() => users.value.find((u) => u.id === id) ?? null);

  const fetchUser = async (userId: string): Promise<Nullable<User>> => {
    try {
      const { data } = await useAsyncQuery<Record<"user", User>>(userQuery, { userId });
      if (data.value) {
        user.value = data.value.user;
        return data.value.user;
      }
      return null;
    } catch {
      return null;
    }
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
    loading.value = true;

    try {
      const { data } = await useAsyncQuery<UserResponse>(usersQuery);
      if (data.value) {
        users.value = data.value.users;
        return data.value.users;
      }
      return null;
    } catch {
      return null;
    } finally {
      loading.value = false;
    }
  };

  const clearUsers = (): void => {
    users.value = [];
  };

  return {
    user,
    departments,
    positions,
    users,
    loading,

    getUser,
    getUsers,
    getUserById,

    fetchUser,
    fetchDepartments,
    fetchPositions,
    fetchUsers,
    clearUsers,
  };
};
