import { type ComponentProps, type FormEvent } from "react";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldError,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";

const DEMO_PASSWORD = "Password123!";

const DEMO_USERS = [
  { key: "admin", label: "Админ", email: "admin@demo.local" },
  { key: "supplier", label: "Поставщик", email: "supplier1@demo.local" },
  { key: "buyer", label: "Покупатель", email: "buyer1@demo.local" },
] as const;

type LoginFormProps = Omit<ComponentProps<"div">, "onSubmit"> & {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onDemoLogin: (email: string, password: string) => Promise<void>;
  submitLabel: string;
  disabled?: boolean;
  submitDisabled?: boolean;
  errorMessage?: string | null;
  onSwitchToSignup: () => void;
};

export function LoginForm({
  className,
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onDemoLogin,
  submitLabel,
  disabled = false,
  submitDisabled = false,
  errorMessage,
  onSwitchToSignup,
  ...props
}: LoginFormProps) {
  return (
    <div
      className={cn("flex flex-col gap-6 text-foreground", className)}
      {...props}
    >
      <Card className="bg-card border-border shadow-none">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-xl font-semibold text-foreground">
            С возвращением
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Войдите, чтобы продолжить свой путь
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            {errorMessage ? <FieldError>{errorMessage}</FieldError> : null}
            <FieldGroup>
              <Field>
                <FieldLabel
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => onEmailChange(event.target.value)}
                  disabled={disabled}
                  className="bg-card border-input text-foreground placeholder:text-muted-foreground"
                />
              </Field>
              <Field>
                <FieldLabel
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Пароль
                </FieldLabel>
                <Input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => onPasswordChange(event.target.value)}
                  disabled={disabled}
                  className="bg-card border-input text-foreground placeholder:text-muted-foreground"
                />
              </Field>
              <Field>
                <Button
                  type="submit"
                  disabled={submitDisabled || disabled}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {submitLabel}
                </Button>
              </Field>
            </FieldGroup>

            <div className="demo-users">
              <p>Знакомитесь с сервисом? Выберите демоаккаунт</p>
              <div>
                {DEMO_USERS.map((user) => (
                  <Button
                    key={user.key}
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    onClick={() => {
                      void onDemoLogin(user.email, DEMO_PASSWORD);
                    }}
                  >
                    {user.label}
                  </Button>
                ))}
              </div>
            </div>
            <FieldDescription className="text-center text-sm text-muted-foreground">
              Ещё нет аккаунта?{" "}
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="underline-offset-4 hover:underline text-foreground"
              >
                Зарегистрироваться
              </button>
            </FieldDescription>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
