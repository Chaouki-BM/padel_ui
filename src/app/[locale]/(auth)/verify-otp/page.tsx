"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";

/** Legacy route — email links use `/verify-email?token=`. */
function RedirectToVerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const qs = token ? `?token=${encodeURIComponent(token)}` : "";
    router.replace(`/verify-email${qs}`);
  }, [router, token]);

  return null;
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <RedirectToVerifyEmail />
    </Suspense>
  );
}
