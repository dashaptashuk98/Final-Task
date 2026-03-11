export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuth } = useAuth();
  if (!isAuth.value && !to.path.includes("auth")) {
    return navigateTo("/auth/login");
  }
  if (isAuth.value && to.path.includes("auth")) {
    return from.path.includes("auth") ? navigateTo("/users") : navigateTo(from);
  }
});
