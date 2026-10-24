"use client";

import { Suspense, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api-error-message";
import { useVerifyEmail } from "@/hooks/useAuth";

function VerifyEmailContent() {
  const t = useTranslations("authForms");
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const mutation = useVerifyEmail();
  const [status, setStatus] = useState<"idle" | "ok" | "error">(
    token ? "idle" : "error",
  );

  useEffect(() => {
    if (!token) {
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        await mutation.mutateAsync(token);
        if (!cancelled) {
          setStatus("ok");
          toast.success(t("verifySuccess"));
        }
      } catch (err) {
        if (!cancelled) {
          setStatus("error");
          toast.error(getApiErrorMessage(err, t("errorGeneric")));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- verify once per token
  }, [token]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="mb-2 text-3xl font-black tracking-tight text-[#0B1A2D]">
          {t("verifyTitle")}
        </h1>
        <p className="font-medium text-slate-500">{t("verifySubtitle")}</p>
      </div>

      {!token ? (
        <p className="text-sm font-medium text-red-600">{t("verifyMissingToken")}</p>
      ) : status === "idle" ? (
        <p className="text-sm text-slate-500">{t("submitting")}</p>
      ) : status === "ok" ? (
        <p className="text-sm font-medium text-slate-700">{t("verifySuccess")}</p>
      ) : (
        <p className="text-sm font-medium text-red-600">{t("errorGeneric")}</p>
      )}

      <Button asChild className="rounded-xl bg-[#0B1A2D] font-semibold text-white">
        <Link href="/login">{t("backToLogin")}</Link>
      </Button>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
