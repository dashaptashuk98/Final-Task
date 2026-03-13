export const checkRights = (userId: string): boolean => {
  const { authId } = useAuth();
  return String(authId.value) === userId;
};
