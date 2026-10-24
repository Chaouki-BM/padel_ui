"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight } from "lucide-react";
import { getApiErrorMessage } from "@/lib/api-error-message";
import { forgotPasswordBodySchema } from "@/schemas/auth";
import { useForgotPassword } from "@/hooks/useAuth";

type ForgotBody = z.infer<typeof forgotPasswordBodySchema>;

export default function ForgotPasswordPage() {
  const t = useTranslations("authForms");
  const mutation = useForgotPassword();
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotBody>({
    resolver: zodResolver(forgotPasswordBodySchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotBody) {
    try {
      await mutation.mutateAsync(values.email);
      setDone(true);
      toast.success(t("forgotSuccess"));
    } catch (err) {
      toast.error(getApiErrorMessage(err, t("errorGeneric")));
    }
  }

  const busy = isSubmitting || mutation.isPending;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="mb-2 text-3xl font-black tracking-tight text-[#0B1A2D]">
          {t("forgotTitle")}
        </h1>
        <p className="font-medium text-slate-500">{t("forgotSubtitle")}</p>
      </div>

      {done ? (
        <p className="rounded-xl bg-slate-50 p-4 text-sm font-medium text-slate-700">
          {t("forgotSuccess")}
        </p>
      ) : (
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
                className="rounded-xl border-slate-200 bg-slate-50 py-6 pl-10"
                placeholder={t("emailPlaceholder")}
                {...register("email")}
              />
            </div>
            {errors.email ? (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            ) : null}
          </div>
          <Button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-[#0B1A2D] py-6 font-semibold text-white"
          >
            {busy ? t("submitting") : t("forgotSubmit")}{" "}
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
