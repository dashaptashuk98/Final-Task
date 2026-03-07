import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, maxLength } from "@vuelidate/validators";
import type { AuthField } from "~/types/auth";
export const useValidateAuth = () => {
  const { login, signup } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const route = useRoute();

  const loginFields = ref<AuthField[]>([
    {
      key: "email",
      label: "Email",
      type: "email",
      value: "",
      placeholder: "Email",
      errorMessage: "",
    },
    {
      key: "password",
      label: "Password",
      type: "password",
      value: "",
      placeholder: "Password",
      errorMessage: "",
    },
  ]);

  const formData = computed(() => ({
    email: loginFields.value.find((f) => f.key === "email")?.value || "",
    password: loginFields.value.find((f) => f.key === "password")?.value || "",
  }));

  const rules = {
    email: {
      required,
      email,
    },
    password: {
      required,
      minLength: minLength(6),
      maxLength: maxLength(18),
    },
  };

  const v$ = useVuelidate(rules, formData);

  const isFieldInvalid = (fieldName: string) => {
    return v$.value[fieldName]?.$invalid && v$.value[fieldName]?.$dirty;
  };

  watchEffect(() => {
    const emailField = loginFields.value.find((f) => f.key === "email");
    const passwordField = loginFields.value.find((f) => f.key === "password");

    if (emailField) {
      emailField.error = isFieldInvalid("email");
      emailField.errorMessage = (v$.value.email.$errors[0]?.$message as string) || "";
    }
    if (passwordField) {
      passwordField.error = isFieldInvalid("password");
      passwordField.errorMessage = (v$.value.password.$errors[0]?.$message as string) || "";
    }
  });

  async function handleAuth() {
    try {
      v$.value.$touch();

      const isValid = await v$.value.$validate();

      if (!isValid) {
        return;
      }

      if (route.name && (route.name as string).split("-").at(-1) === "signup") {
        const result = await signup(formData.value.email, formData.value.password);
        showToast(result, "Account created", "User is already exists");
        return;
      }

      const result = await login(formData.value.email, formData.value.password);
      showToast(result, "Logged in successfully", "Incorrect credentials");
    } catch (err) {
      let errorDetail = "Unexpected error";
      if (err instanceof Error) {
        errorDetail = err.message;
      } else if (typeof err === "string") {
        errorDetail = err;
      }

      toast.add({
        severity: "error",
        summary: "Error",
        detail: errorDetail,
        life: 5000,
      });
    }
  }

  const showToast = async (
    result: unknown,
    successMessage: string,
    errorMessage: string,
  ): Promise<void> => {
    if (result) {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: successMessage,
        life: 3000,
      });
      await router.push("/users");
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: errorMessage,
        life: 5000,
      });
    }
  };

  return { loginFields, handleAuth };
};
