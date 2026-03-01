import { defineStore } from "pinia";
import type { AxiosError } from "axios";
import axios from "axios";
import type { User, UserUI } from "../types/user";
import type { ApiErrorResponse } from "../types/auth";

export const useUsersStore = defineStore("users", () => {
  const users = ref<UserUI[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const getUsers = computed(() => users.value);

  const getUserById = (id: string) => computed(() => users.value.find((u) => u.id === id));

  function mapUserToUI(user: User): UserUI {
    return {
      id: user.id,
      firstName: user.profile?.first_name || "",
      lastName: user.profile?.last_name || "",
      email: user.email,
      department: user.department?.name || "",
      position: user.position?.name || "",
      avatar: user.profile?.avatar || null,
      role: user.role || "user",
      isVerified: user.is_verified || false,
    };
  }

  async function fetchUsers() {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get<User[]>("/api/employee/users");
      users.value = response.data.map(mapUserToUI);
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
  }

  function clearUsers() {
    users.value = [];
    error.value = null;
  }

  return {
    users,
    loading,
    error,
    getUsers,
    getUserById,
    fetchUsers,
    clearUsers,
  };
});
