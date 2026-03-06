export default defineNuxtPlugin(async () => {
  const { loadAuthUser } = useAuth();

  await loadAuthUser();
});
