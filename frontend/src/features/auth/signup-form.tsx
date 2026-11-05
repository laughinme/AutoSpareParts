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

type SignupFormProps = Omit<ComponentProps<"div">, "onSubmit"> & {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitLabel: string;
  disabled?: boolean;
  submitDisabled?: boolean;
  errorMessage?: string | null;
  onSwitchToLogin: () => void;
};

export function SignupForm({
  className,
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  submitLabel,
  disabled = false,
  submitDisabled = false,
  errorMessage,
  onSwitchToLogin,
  ...props
}: SignupFormProps) {
  return (
    <div
      className={cn("flex flex-col gap-6 text-foreground", className)}
      {...props}
    >
      <Card className="bg-card border-border shadow-none">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-xl font-semibold text-foreground">
            Давайте знакомиться
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Создайте аккаунт и найдите нужные запчасти
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <FieldGroup>
              {errorMessage ? <FieldError>{errorMessage}</FieldError> : null}
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
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => onPasswordChange(event.target.value)}
                  disabled={disabled}
                  className="bg-card border-input text-foreground placeholder:text-muted-foreground"
                />
                <FieldDescription className="text-muted-foreground">
                  Не менее 8 символов.
                </FieldDescription>
              </Field>
              <Field>
                <Button
                  type="submit"
                  disabled={submitDisabled || disabled}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {submitLabel}
                </Button>
                <FieldDescription className="text-center text-sm text-muted-foreground">
                  Уже есть аккаунт?{" "}
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="underline-offset-4 hover:underline text-foreground"
                  >
                    Войти
                  </button>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
