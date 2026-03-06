import type { GraphQLError } from "graphql";
export default defineNuxtPlugin((nuxtApp) => {
  const { refreshToken, logout } = useAuth();

  nuxtApp.hook("apollo:error", async (error) => {
    if (import.meta.server) return;
    const router = useRouter();

    const isUnauthorized: boolean = error.graphQLErrors?.some(
      (err: GraphQLError) =>
        err.message === "Unauthorized" || err.extensions.code === "UNAUTHENTICATED",
    );

    if (!isUnauthorized) {
      return;
    }

    try {
      const success = await refreshToken();

      if (!success) {
        await logout();

        if (router.currentRoute.value.path !== "auth/login") {
          await router.push("/auth/login");
        }
      }
    } catch {
      await logout();

      if (router.currentRoute.value.path !== "auth/login") {
        await router.push("/auth/login");
      }
    }
  });
});
