export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("apollo:error", async (error) => {
    // const { refreshAgain } = useAuth();
    console.log(error);
    if (error.response) {
      for (const err of error.response.errors) {
        if (err.message === "Unauthorized") {
          console.log(err.message);
          // await refreshAgain();
        }
      }
    }
  });
});
