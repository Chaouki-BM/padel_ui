"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { registerPath, safeNextPath } from "@/lib/auth";
import { getApiErrorMessage } from "@/lib/api-error-message";
import { loginBodySchema, type LoginBody } from "@/schemas/auth";
import { useLogin } from "@/hooks/useAuth";

function LoginForm() {
  const t = useTranslations("authForms");
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNextPath(searchParams.get("next"));
  const loginMutation = useLogin();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginBody>({
    resolver: zodResolver(loginBodySchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginBody) {
    setFormError(null);
    try {
      await loginMutation.mutateAsync(values);
      router.push(next);
    } catch (err) {
      const message = getApiErrorMessage(err, t("errorGeneric"));
      setFormError(message);
      toast.error(message);
    }
  }

  const busy = isSubmitting || loginMutation.isPending;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="mb-2 text-3xl font-black tracking-tight text-[#0B1A2D]">
          {t("loginTitle")}
        </h1>
        <p className="font-medium text-slate-500">{t("loginSubtitle")}</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-900" htmlFor="email">
            {t("email")}
          </label>
          <div className="relative">
            <Mail className="absolute top-3.5 left-3 h-5 w-5 text-slate-400" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder={t("emailPlaceholder")}
              className="rounded-xl border-slate-200 bg-slate-50 py-6 pl-10 focus-visible:ring-[#C0FF00] focus-visible:ring-offset-2"
              {...register("email")}
            />
          </div>
          {errors.email ? (
            <p className="text-xs font-medium text-red-600">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-900" htmlFor="password">
              {t("password")}
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-bold text-slate-500 transition-colors hover:text-[#0B1A2D]"
            >
              {t("forgotPassword")}
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute top-3.5 left-3 h-5 w-5 text-slate-400" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="rounded-xl border-slate-200 bg-slate-50 py-6 pl-10 focus-visible:ring-[#C0FF00] focus-visible:ring-offset-2"
              {...register("password")}
            />
          </div>
          {errors.password ? (
            <p className="text-xs font-medium text-red-600">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        {formError ? (
          <p className="text-sm font-medium text-red-600" role="alert">
            {formError}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={busy}
          className="mt-2 w-full rounded-xl bg-[#0B1A2D] py-6 text-base font-semibold text-white shadow-lg shadow-[#0B1A2D]/10 hover:bg-[#0B1A2D]/90"
        >
          {busy ? t("submitting") : t("loginSubmit")}{" "}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </form>

      <p className="mt-2 text-center text-sm font-medium text-slate-500">
        {t("noAccount")}{" "}
        <Link
          href={registerPath(searchParams.get("next"))}
          className="font-bold text-[#0B1A2D] hover:underline"
        >
          {t("createAccount")}
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
