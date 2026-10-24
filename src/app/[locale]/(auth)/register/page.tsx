"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User, ArrowRight, MapPin, Calendar } from "lucide-react";
import { loginPath, safeNextPath } from "@/lib/auth";
import { getApiErrorMessage } from "@/lib/api-error-message";
import { LEVEL_CODES } from "@/lib/constants";
import { registerBodySchema } from "@/schemas/auth";
import { useRegister } from "@/hooks/useAuth";

type RegisterFormValues = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  nationality: "TN";
  birthDate: string;
  city: string;
  phone?: string;
  level?: string;
};

function RegisterForm() {
  const t = useTranslations("authForms");
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNextPath(searchParams.get("next"));
  const registerMutation = useRegister();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      nationality: "TN",
      birthDate: "",
      city: "",
      phone: "",
      level: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setFormError(null);
    try {
      const parsed = registerBodySchema.parse({
        ...values,
        nationality: "TN",
        phone: values.phone || undefined,
        level:
          values.level && values.level.length > 0 ? values.level : undefined,
      });
      await registerMutation.mutateAsync(parsed);
      router.push(next);
    } catch (err) {
      const message = getApiErrorMessage(err, t("errorGeneric"));
      setFormError(message);
      toast.error(message);
    }
  }

  const busy = isSubmitting || registerMutation.isPending;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="mb-2 text-3xl font-black tracking-tight text-[#0B1A2D]">
          {t("registerTitle")}
        </h1>
        <p className="font-medium text-slate-500">{t("registerSubtitle")}</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900" htmlFor="firstName">
              {t("firstName")}
            </label>
            <div className="relative">
              <User className="absolute top-3.5 left-3 h-5 w-5 text-slate-400" />
              <Input
                id="firstName"
                className="rounded-xl border-slate-200 bg-slate-50 py-6 pl-10"
                {...register("firstName")}
              />
            </div>
            {errors.firstName ? (
              <p className="text-xs text-red-600">{errors.firstName.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900" htmlFor="lastName">
              {t("lastName")}
            </label>
            <Input
              id="lastName"
              className="rounded-xl border-slate-200 bg-slate-50 py-6"
              {...register("lastName")}
            />
            {errors.lastName ? (
              <p className="text-xs text-red-600">{errors.lastName.message}</p>
            ) : null}
          </div>
        </div>

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
              className="rounded-xl border-slate-200 bg-slate-50 py-6 pl-10"
              {...register("email")}
            />
          </div>
          {errors.email ? (
            <p className="text-xs text-red-600">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-900" htmlFor="password">
            {t("password")}
          </label>
          <div className="relative">
            <Lock className="absolute top-3.5 left-3 h-5 w-5 text-slate-400" />
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className="rounded-xl border-slate-200 bg-slate-50 py-6 pl-10"
              {...register("password")}
            />
          </div>
          <p className="text-xs text-slate-500">{t("passwordHint")}</p>
          {errors.password ? (
            <p className="text-xs text-red-600">{errors.password.message}</p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900" htmlFor="city">
              {t("city")}
            </label>
            <div className="relative">
              <MapPin className="absolute top-3.5 left-3 h-5 w-5 text-slate-400" />
              <Input
                id="city"
                placeholder={t("cityPlaceholder")}
                className="rounded-xl border-slate-200 bg-slate-50 py-6 pl-10"
                {...register("city")}
              />
            </div>
            {errors.city ? (
              <p className="text-xs text-red-600">{errors.city.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900" htmlFor="birthDate">
              {t("birthDate")}
            </label>
            <div className="relative">
              <Calendar className="absolute top-3.5 left-3 h-5 w-5 text-slate-400" />
              <Input
                id="birthDate"
                type="date"
                className="rounded-xl border-slate-200 bg-slate-50 py-6 pl-10"
                {...register("birthDate")}
              />
            </div>
            {errors.birthDate ? (
              <p className="text-xs text-red-600">{errors.birthDate.message}</p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900" htmlFor="phone">
              {t("phone")}
            </label>
            <Input
              id="phone"
              type="tel"
              className="rounded-xl border-slate-200 bg-slate-50 py-6"
              {...register("phone")}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900" htmlFor="level">
              {t("levelOptional")}
            </label>
            <select
              id="level"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium"
              {...register("level")}
            >
              <option value="">—</option>
              {LEVEL_CODES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>
        </div>

        <input type="hidden" {...register("nationality")} value="TN" />

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
          {busy ? t("submitting") : t("registerSubmit")}{" "}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </form>

      <p className="mt-2 text-center text-sm font-medium text-slate-500">
        {t("hasAccount")}{" "}
        <Link
          href={loginPath(searchParams.get("next"))}
          className="font-bold text-[#0B1A2D] hover:underline"
        >
          {t("loginLink")}
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
