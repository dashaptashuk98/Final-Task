export const checkRights = (userId?: string): boolean => {
  const { authId, authUser } = useAuth();
  if (authUser.value) {
    if (!userId) {
      return authUser.value.role === "Admin";
    }
    return String(authId.value) === userId || authUser.value.role === "Admin";
  }
  return false;
};
