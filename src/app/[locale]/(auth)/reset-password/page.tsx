"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, ArrowRight } from "lucide-react";
import { getApiErrorMessage } from "@/lib/api-error-message";
import { useResetPassword } from "@/hooks/useAuth";

const formSchema = z.object({
  password: z
    .string()
    .min(8)
    .regex(/[A-Za-z]/, "letter")
    .regex(/\d/, "digit"),
});

type FormValues = z.infer<typeof formSchema>;

function ResetPasswordForm() {
  const t = useTranslations("authForms");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const mutation = useResetPassword();
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "" },
  });

  async function onSubmit(values: FormValues) {
    if (!token) {
      toast.error(t("resetMissingToken"));
      return;
    }
    try {
      await mutation.mutateAsync({ token, password: values.password });
      setDone(true);
      toast.success(t("resetSuccess"));
      router.push("/login");
    } catch (err) {
      toast.error(getApiErrorMessage(err, t("errorGeneric")));
    }
  }

  const busy = isSubmitting || mutation.isPending;

  if (!token) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-black text-[#0B1A2D]">{t("resetTitle")}</h1>
        <p className="text-sm font-medium text-red-600">{t("resetMissingToken")}</p>
        <Link href="/forgot-password" className="font-bold text-[#0B1A2D]">
          {t("forgotPassword")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="mb-2 text-3xl font-black tracking-tight text-[#0B1A2D]">
          {t("resetTitle")}
        </h1>
        <p className="font-medium text-slate-500">{t("resetSubtitle")}</p>
      </div>

      {done ? (
        <p className="text-sm font-medium text-slate-700">{t("resetSuccess")}</p>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
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
                className="rounded-xl border-slate-200 bg-slate-50 py-6 pl-10"
                {...register("password")}
              />
            </div>
            <p className="text-xs text-slate-500">{t("passwordHint")}</p>
            {errors.password ? (
              <p className="text-xs text-red-600">{errors.password.message}</p>
            ) : null}
          </div>
          <Button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-[#0B1A2D] py-6 font-semibold text-white"
          >
            {busy ? t("submitting") : t("resetSubmit")}{" "}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </form>
      )}

      <p className="text-center text-sm">
        <Link href="/login" className="font-bold text-[#0B1A2D] hover:underline">
          {t("backToLogin")}
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
