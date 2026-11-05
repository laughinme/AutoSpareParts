import { useState, type FormEvent, type ReactElement } from "react";
import { Brand } from "@/shared/components/brand";
import { RepositoryLink } from "@/shared/components/repository-link";
import { useAuth } from "@/app/providers/auth/useAuth";
import type { AuthCredentials } from "@/entities/auth/model";
import { LoginForm } from "@/features/auth/login-form";
import { SignupForm } from "@/features/auth/signup-form";

type Mode = "login" | "register";

const getErrorMessage = (error: unknown): string => {
  if (!error) {
    return "Произошла ошибка";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { detail?: unknown } } })
      .response;
    const detail = response?.data?.detail;
    if (typeof detail === "string") {
      return detail;
    }
  }

  return "Произошла ошибка";
};

export default function AuthPage(): ReactElement {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const auth = useAuth();

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 text-slate-700">
        <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-red-500">
            Контекст аутентификации не найден
          </h2>
          <p className="mt-2">
            Убедитесь, что используете компонент внутри `AuthProvider`.
          </p>
        </div>
      </div>
    );
  }

  const {
    login,
    register,
    isLoggingIn,
    loginError,
    isRegistering,
    registerError,
  } = auth;

  const isLoading = isLoggingIn || isRegistering;
  const error = mode === "login" ? loginError : registerError;
  const errorMessage = error ? getErrorMessage(error) : null;
  const canSubmit = Boolean(email.trim() && password.trim() && !isLoading);

  const authenticate = async (credentials: AuthCredentials) => {
    try {
      if (mode === "login") {
        await login(credentials);
      } else {
        await register(credentials);
      }
    } catch (err) {
      console.error("Ошибка аутентификации:", err);
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (canSubmit) void authenticate({ email: email.trim(), password });
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    if (isLoading) return;
    setEmail(demoEmail);
    setPassword(demoPassword);
    await authenticate({ email: demoEmail, password: demoPassword });
  };

  const formProps = {
    email,
    password,
    onEmailChange: setEmail,
    onPasswordChange: setPassword,
    onSubmit: submit,
    disabled: isLoading,
    submitDisabled: !canSubmit,
    errorMessage,
  };

  return (
    <main className="auth-page">
      <aside className="auth-story">
        <Brand compact />
        <img src="/marketplace/brake-assembly.jpg" alt="" className="auth-art" />
        <div className="auth-story-copy">
          <p className="auth-story-title">Всё дело<br />в деталях.</p>
          <p>Каталог автозапчастей, заказы и личный гараж в одном аккаунте.</p>
        </div>
      </aside>
      <section
        className="auth-form-panel"
        aria-label={mode === "login" ? "Вход в аккаунт" : "Регистрация"}
      >
        <RepositoryLink className="auth-repository-link" />
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand">
            <Brand />
          </div>
          {mode === "login" ? (
            <LoginForm
              {...formProps}
              onDemoLogin={handleDemoLogin}
              submitLabel={isLoading ? "Входим…" : "Войти"}
              onSwitchToSignup={() => setMode("register")}
            />
          ) : (
            <SignupForm
              {...formProps}
              submitLabel={isLoading ? "Создаём аккаунт…" : "Создать аккаунт"}
              onSwitchToLogin={() => setMode("login")}
            />
          )}
        </div>
      </section>
    </main>
  );
}
