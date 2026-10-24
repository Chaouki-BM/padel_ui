"use client";

import { Suspense, use, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBooking } from "@/hooks/useBookings";
import { usePreviewPromotion } from "@/hooks/useAds";
import {
  useMockConfirmPayment,
  useMockFailPayment,
  usePaymentReceipt,
} from "@/hooks/usePayments";
import { getApiErrorMessage } from "@/lib/api-error-message";

type PageProps = {
  params: Promise<{ paymentId: string }>;
};

function PayContent({ paymentId }: { paymentId: string }) {
  const t = useTranslations("payPage");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId") ?? "";
  const confirm = useMockConfirmPayment();
  const fail = useMockFailPayment();
  const previewPromo = usePreviewPromotion();
  const [outcome, setOutcome] = useState<"success" | "fail" | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoHint, setPromoHint] = useState<string | null>(null);

  const bookingQuery = useBooking(bookingId, {
    refetchInterval:
      outcome === null && bookingId.length > 0 ? 2000 : false,
  });

  const isSuccess =
    outcome === "success" || bookingQuery.data?.status === "CONFIRMED";
  const isFail = outcome === "fail";
  const showActions = !isSuccess && !isFail;

  const receiptQuery = usePaymentReceipt(isSuccess ? paymentId : "");

  async function handlePreviewPromo() {
    const code = promoCode.trim();
    if (!code) return;
    try {
      const result = await previewPromo.mutateAsync({
        code,
        amount: bookingQuery.data?.price,
      });
      if (result.valid) {
        setPromoHint(
          result.finalAmount !== null
            ? t("promoOk", {
                discount: result.discountAmount,
                final: result.finalAmount,
              })
            : t("promoOkSimple", { discount: result.discountAmount }),
        );
        toast.success(t("promoApplied"));
      } else {
        setPromoHint(result.message || t("promoInvalid"));
        toast.error(t("promoInvalid"));
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, tCommon("error")));
    }
  }

  async function handleConfirm() {
    try {
      await confirm.mutateAsync(paymentId);
      setOutcome("success");
      toast.success(t("success"));
      if (bookingId) {
        void bookingQuery.refetch();
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, tCommon("error")));
    }
  }

  async function handleFail() {
    try {
      await fail.mutateAsync(paymentId);
      setOutcome("fail");
      toast.error(t("failed"));
    } catch (err) {
      toast.error(getApiErrorMessage(err, tCommon("error")));
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-10">
      <header>
        <h1 className="text-2xl font-black text-[#0B1A2D]">{t("title")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>
        <p className="mt-2 font-mono text-xs text-slate-400">{paymentId}</p>
      </header>

      {bookingId ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-4 text-sm">
          <p className="font-bold text-[#0B1A2D]">
            {bookingQuery.data?.clubName ?? "…"}
          </p>
          <p className="mt-1 text-slate-600">
            {bookingQuery.data?.dateLabel} · {bookingQuery.data?.timeLabel}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {t("status")}: {bookingQuery.data?.status ?? "…"}
          </p>
        </div>
      ) : null}

      {showActions ? (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <Input
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder={t("promoPlaceholder")}
              className="h-12"
            />
            <Button
              type="button"
              variant="outline"
              disabled={previewPromo.isPending || !promoCode.trim()}
              onClick={() => void handlePreviewPromo()}
              className="h-12 shrink-0 rounded-xl"
            >
              {t("promoApply")}
            </Button>
          </div>
          {promoHint ? (
            <p className="text-xs font-medium text-slate-600">{promoHint}</p>
          ) : null}
          <Button
            type="button"
            disabled={confirm.isPending}
            onClick={() => void handleConfirm()}
            className="h-12 rounded-xl bg-[#C0FF00] font-black text-[#0B1A2D]"
          >
            {t("confirm")}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={fail.isPending}
            onClick={() => void handleFail()}
            className="h-12 rounded-xl border-red-200 text-red-600"
          >
            {t("fail")}
          </Button>
        </div>
      ) : null}

      {isSuccess ? (
        <div className="space-y-4 rounded-2xl border border-[#C0FF00]/40 bg-[#F3FFCC] p-5">
          <p className="font-bold text-[#0B1A2D]">{t("success")}</p>
          {receiptQuery.data ? (
            <div className="text-sm text-[#0B1A2D]/80">
              <p>
                {t("receipt")}: {receiptQuery.data.number}
              </p>
              <p>
                {receiptQuery.data.amount} TND · {receiptQuery.data.clubName}
              </p>
            </div>
          ) : null}
          <Button
            type="button"
            onClick={() => router.push("/player/bookings")}
            className="w-full rounded-xl bg-[#0B1A2D] font-semibold text-white"
          >
            {t("goBookings")}
          </Button>
        </div>
      ) : null}

      {isFail ? (
        <div className="space-y-4 rounded-2xl border border-red-100 bg-red-50 p-5">
          <p className="font-bold text-red-700">{t("failed")}</p>
          <Button asChild variant="outline" className="w-full rounded-xl">
            <Link href="/player/bookings">{t("goBookings")}</Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export default function PayPage({ params }: PageProps) {
  const { paymentId } = use(params);
  return (
    <Suspense fallback={null}>
      <PayContent paymentId={paymentId} />
    </Suspense>
  );
}
