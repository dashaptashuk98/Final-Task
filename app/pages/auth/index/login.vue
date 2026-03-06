<template>
  <div class="auth-page">
    <div class="auth-content">
      <h1 class="welcome-title">С возвращением</h1>
      <p class="welcome-subtitle">Рады вас видеть! Войдите, чтобы продолжить</p>

      <AuthForm :fields="loginFields" button-text="ВОЙТИ" :loading="isLoading" />

      <div class="button-wrapper">
        <Button
          type="submit"
          label="ВОЙТИ"
          :loading="isLoading"
          :disabled="isLoading"
          class="auth-button"
          @click="handleLogin" />
      </div>

      <div class="auth-links">
        <Button
          link
          label="СОЗДАТЬ АККАУНТ"
          class="link-button"
          @click="navigateTo('/auth/register')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useToast } from "primevue/usetoast";
  import { useVuelidate } from "@vuelidate/core";
  import { required, email, minLength } from "@vuelidate/validators";
  import Button from "primevue/button";
  import AuthForm from "~/components/AuthForm.vue";
  import type { AuthField } from "~/types/auth";
  import { useAuth } from "~/composables/useAuth";

  definePageMeta({
    layout: false,
  });

  const { login, isLoading, error, clearError } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const loginFields = ref<AuthField[]>([
    {
      key: "email",
      label: "Почта",
      type: "email",
      value: "",
      placeholder: "Почта",
      errorMessage: "",
    },
    {
      key: "password",
      label: "Пароль",
      type: "password",
      value: "",
      placeholder: "Пароль",
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

  async function handleLogin() {
    try {
      v$.value.$touch();

      const isValid = await v$.value.$validate();

      if (!isValid) {
        error.value = "Пожалуйста, исправьте ошибки в форме";
        return;
      }

      const email = loginFields.value.find((f) => f.key === "email")?.value || "";
      const password = loginFields.value.find((f) => f.key === "password")?.value || "";

      clearError();

      const result = await login({ email, password });

      if (result?.success) {
        toast.add({
          severity: "success",
          summary: "Успешно",
          detail: "Вы успешно вошли в систему",
          life: 3000,
        });
        await router.push("/users");
      } else {
        let errorMessage = "Неверный email или пароль";
        let errorSummary = "Ошибка входа";

        if (result?.error) {
          const errorText = result.error as string;

          errorMessage = errorText;
          if (
            errorText.toLowerCase().includes("not found") ||
            errorText.toLowerCase().includes("не найден") ||
            errorText.toLowerCase().includes("user not found")
          ) {
            errorSummary = "Пользователь не найден";
            errorMessage = "Пользователь с таким email не зарегистрирован";
          } else if (
            errorText.toLowerCase().includes("invalid credentials") ||
            errorText.toLowerCase().includes("password") ||
            errorText.toLowerCase().includes("пароль") ||
            errorText.toLowerCase().includes("invalid password")
          ) {
            errorSummary = "Неверные данные";
            errorMessage = "Неверный email или пароль";
          }
        }

        error.value = errorMessage;

        toast.add({
          severity: "error",
          summary: errorSummary,
          detail: errorMessage,
          life: 5000,
        });
      }
    } catch (err) {
      let errorDetail = "Произошла непредвиденная ошибка";
      if (err instanceof Error) {
        errorDetail = err.message;
      } else if (typeof err === "string") {
        errorDetail = err;
      }

      toast.add({
        severity: "error",
        summary: "Ошибка",
        detail: errorDetail,
        life: 5000,
      });
    }
  }
</script>

<style scoped>
  .auth-page {
    min-height: 100vh;
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    font-family: "Inter", "Roboto", "Open Sans", sans-serif;
  }

  .auth-content {
    width: 100%;
    max-width: 560px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: auto 0;
  }

  .welcome-title {
    font-size: 2rem;
    font-weight: 600;
    color: #2e2e2e;
    text-align: center;
    margin-bottom: 0.5rem;
    letter-spacing: -0.5px;
  }

  .welcome-subtitle {
    font-size: 1rem;
    color: #999;
    text-align: center;
    margin-bottom: 2rem;
    font-weight: 400;
  }

  .error-message {
    margin-bottom: 1.5rem;
    width: 100%;
  }

  .error-message :deep(.p-message) {
    background-color: #fee9e7;
    border: 1px solid #c63031;
    color: #c63031;
    border-radius: 8px;
    padding: 0.75rem 1rem;
  }

  .validation-errors {
    width: 100%;
    margin: 0.5rem 0;
  }

  .error-text {
    color: #c63031;
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
    text-align: left;
  }

  .button-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 1rem;
  }

  .auth-button {
    width: 220px;
    padding: 1rem;
    background-color: #c63031;
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(198, 48, 49, 0.2);
  }

  .auth-button:hover:not(:disabled) {
    background-color: #b52b2b;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(198, 48, 49, 0.3);
  }

  .auth-button:active:not(:disabled) {
    transform: translateY(0);
  }

  .auth-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .auth-links {
    text-align: center;
    margin-top: 1rem;
    width: 100%;
  }

  .link-button {
    color: #999 !important;
    font-size: 0.85rem;
    font-weight: 500;
    letter-spacing: 0.5px;
  }

  .link-button:hover {
    color: #666 !important;
  }

  .link-button :deep(.p-button-label) {
    font-weight: 500;
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    .auth-page {
      padding: 1.5rem 1rem 0;
    }

    .auth-content {
      max-width: 100%;
    }

    .welcome-title {
      font-size: 1.75rem;
    }
  }
</style>
