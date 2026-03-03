import type { AxiosError } from "axios";
import axios from "axios";
import type { ApiErrorResponse } from "~/types/auth";
import type { Department } from "~/types/departments";
import type { Position } from "~/types/positions";
import type { User as FullUser } from "~/types/user";
import type { User } from "~/types/userTable";
import type { Nullable } from "~/types/types";

export const useUsers = () => {
  const user = useState<Nullable<FullUser>>("user", () => null);
  const departments = useState<Department[]>("departments", () => []);
  const positions = useState<Position[]>("positions", () => []);
  const users = useState<User[]>("users", () => []);

  const loading = ref(false);
  const error = ref<Nullable<string>>(null);

  const getUser = computed<Nullable<FullUser>>(() => user.value);
  const getUsers = computed<User[]>(() => users.value);

  const getUserById = (id: string): ComputedRef<Nullable<User>> =>
    computed(() => users.value.find((u) => u.id === id) ?? null);

  const fetchUser = async (userId: string): Promise<Nullable<FullUser>> => {
    try {
      const data = await $fetch<FullUser>(`/api/users/${userId}`);
      user.value = data;
      return data;
    } catch {
      return null;
    }
  };

  const fetchDepartments = async (): Promise<Nullable<Department[]>> => {
    try {
      const data = await $fetch<Department[]>("/api/departments");
      departments.value = data;
      return data;
    } catch {
      return null;
    }
  };

  const fetchPositions = async (): Promise<Nullable<Position[]>> => {
    try {
      const data = await $fetch<Position[]>("/api/positions");
      positions.value = data;
      return data;
    } catch {
      return null;
    }
  };

  const fetchUsers = async (): Promise<{ success: boolean; data?: User[]; error?: string }> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get<User[]>("/api/employee/users");
      users.value = response.data;

      return { success: true, data: users.value };
    } catch (err) {
      let errorMessage = "Ошибка загрузки пользователей";

      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ApiErrorResponse>;
        errorMessage =
          axiosError.response?.data?.message || axiosError.response?.data?.error || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  const clearUsers = (): void => {
    users.value = [];
    error.value = null;
  };

  return {
    user,
    departments,
    positions,
    users,
    loading,
    error,

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
