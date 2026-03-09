export default defineNuxtRouteMiddleware((_to, _from) => {
  const { isAuth } = useAuth();
  if (!isAuth.value) {
    return navigateTo("/auth/login");
  }
});
