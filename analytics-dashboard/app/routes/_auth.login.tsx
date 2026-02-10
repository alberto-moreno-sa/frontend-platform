import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Link, useActionData, useNavigation } from "react-router";
import type { ActionFunctionArgs, MetaFunction } from "react-router";
import { useTranslation } from "react-i18next";
import { Button, Input } from "@ahiggs-ui/react";
import { AuthLogo } from "~/components/auth/AuthLogo";
import { AuthTabSwitcher } from "~/components/auth/AuthTabSwitcher";
import { loginFormSchema, type LoginFormData } from "~/lib/validators";
import { loginApi, ApiError } from "~/services/auth.server";
import { createUserSession } from "~/services/session.server";
import { logger } from "~/lib/logger.server";

const log = logger.child({ component: "login-action" });

export const meta: MetaFunction = () => [{ title: "Log in | Analytics Dashboard" }];

interface ActionData {
  errors?: Record<string, string[]>;
  serverError?: string;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  // Server-side validation
  const parsed = loginFormSchema.safeParse({ email, password });
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, serverError: undefined };
  }

  try {
    const result = await loginApi({ email, password });
    const now = Math.floor(Date.now() / 1000);

    return createUserSession(
      {
        accessToken: result.data.access_token,
        refreshToken: result.data.refresh_token,
        expiresAt: now + result.data.expires_in,
        user: {
          id: result.data.user.id,
          email: result.data.user.email,
          name: result.data.user.name,
        },
      },
      "/",
    );
  } catch (error) {
    if (error instanceof ApiError) {
      log.warn({ email, code: error.code }, "Login failed");
      return { errors: undefined, serverError: error.message };
    }
    log.error({ err: error, email }, "Unexpected login error");
    return { errors: undefined, serverError: "An unexpected error occurred" };
  }
}

export default function LoginPage() {
  const { t } = useTranslation();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const {
    register,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    mode: "onBlur",
  });

  return (
    <div>
      <AuthLogo />

      <h1 className="text-center text-2xl font-semibold text-text-primary">
        {t("auth.login.title")}
      </h1>
      <p className="mt-2 text-center text-base text-text-tertiary">
        {t("auth.login.subtitle")}
      </p>

      <div className="mt-8">
        <AuthTabSwitcher />
      </div>

      {actionData?.serverError && (
        <div className="mb-4 rounded-lg border border-error-300 bg-error-25 px-4 py-3 text-sm text-error-700">
          {actionData.serverError}
        </div>
      )}

      <Form method="post" className="flex flex-col gap-5">
        <Input
          label={t("auth.login.email")}
          type="email"
          placeholder={t("auth.login.emailPlaceholder")}
          variant={errors.email || actionData?.errors?.email ? "error" : "default"}
          helperText={errors.email?.message || actionData?.errors?.email?.[0]}
          {...register("email")}
        />

        <Input
          label={t("auth.login.password")}
          type="password"
          placeholder="••••••••"
          variant={errors.password || actionData?.errors?.password ? "error" : "default"}
          helperText={errors.password?.message || actionData?.errors?.password?.[0]}
          {...register("password")}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          loadingText={t("auth.login.submitting")}
          className="w-full"
        >
          {t("auth.login.submit")}
        </Button>
      </Form>

      <p className="mt-8 text-center text-sm text-text-tertiary">
        {t("auth.login.noAccount")}{" "}
        <Link to="/register" className="font-semibold text-brand-700 hover:text-brand-800">
          {t("auth.login.signupLink")}
        </Link>
      </p>
    </div>
  );
}
