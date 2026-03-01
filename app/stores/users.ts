import { defineStore } from "pinia";
import type { Department } from "~~/types/departments";
import type { Position } from "~~/types/positions";
import type { User } from "~~/types/user";

export const useUsersStore = defineStore("users", () => {
  const user = ref<User>();
  const departments = ref<Department[]>();
  const positions = ref<Position[]>();

  const fetchUser = async (userId: string): Promise<User | null> => {
    const { data, error } = await useFetch(`/api/users/${userId}`);

    if (error.value) {
      return null;
    }

    user.value = data.value;

    return user.value ?? null;
  };

  const fetchDepartments = async (): Promise<Department[] | null> => {
    const { data, error } = await useFetch(`/api/departments`);

    if (error.value) {
      return null;
    }

    departments.value = data.value;

    return departments.value ?? null;
  };

  const fetchPositions = async (): Promise<Position[] | null> => {
    const { data, error } = await useFetch(`/api/positions`);

    if (error.value) {
      return null;
    }

    positions.value = data.value;

    return positions.value ?? null;
  };

  return { fetchUser, user, fetchDepartments, departments, fetchPositions, positions };
});
