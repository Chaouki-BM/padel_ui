"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePurchaseTokens, useWallet } from "@/hooks/useWallet";
import { getApiErrorMessage } from "@/lib/api-error-message";
import { formatTunisDate } from "@/lib/format";

export default function WalletPage() {
  const t = useTranslations("walletPage");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useWallet();
  const purchase = usePurchaseTokens();
  const [tokens, setTokens] = useState("50");

  async function handlePurchase() {
    const n = Number(tokens);
    if (!Number.isFinite(n) || n <= 0) {
      toast.error(t("invalidAmount"));
      return;
    }
    try {
      const result = await purchase.mutateAsync(n);
      if (result.paymentId) {
        router.push(`/player/pay/${result.paymentId}`);
        return;
      }
      toast.success(t("purchaseOk"));
      void refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err, tCommon("error")));
    }
  }

  if (isLoading) {
    return (
      <div className="px-4 py-8 text-sm text-slate-500">{tCommon("loading")}</div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-start gap-3 px-4 py-8">
        <p className="text-sm text-red-600">{tCommon("error")}</p>
        <Button type="button" variant="outline" onClick={() => void refetch()}>
          {tCommon("errorRetry")}
        </Button>
      </div>
    );
  }

  const balance = data?.balance ?? 0;
  const txs = data?.transactions ?? [];

  return (
    <div className="mx-auto flex w-full max-w-[640px] flex-col gap-6 px-4 py-6 sm:px-6">
      <header>
        <h1 className="text-2xl font-black text-[#0B1A2D]">{t("title")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>
      </header>

      <section className="rounded-2xl bg-[#0B1A2D] p-6 text-white">
        <p className="text-xs font-bold tracking-widest text-white/60 uppercase">
          {t("balance")}
        </p>
        <p className="mt-2 text-4xl font-black text-[#C0FF00]">
          {balance}{" "}
          <span className="text-base font-bold text-white/80">{t("tokens")}</span>
        </p>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-black text-[#0B1A2D]">{t("buyTitle")}</h2>
        <div className="mt-3 flex gap-2">
          <Input
            type="number"
            min={1}
            value={tokens}
            onChange={(e) => setTokens(e.target.value)}
            className="rounded-xl"
          />
          <Button
            type="button"
            disabled={purchase.isPending}
            onClick={() => void handlePurchase()}
            className="rounded-xl bg-[#0B1A2D] font-semibold text-white"
          >
            {t("buy")}
          </Button>
        </div>
        <p className="mt-2 text-xs text-slate-500">{t("buyHint")}</p>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-black text-[#0B1A2D]">{t("history")}</h2>
        {txs.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">{t("emptyHistory")}</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-50">
            {txs.map((tx) => (
              <li
                key={tx.id}
                className="flex items-center justify-between py-3 text-sm"
              >
                <div>
                  <p className="font-semibold text-[#0B1A2D]">{tx.label}</p>
                  {tx.createdAt ? (
                    <p className="text-xs text-slate-400">
                      {formatTunisDate(tx.createdAt)}
                    </p>
                  ) : null}
                </div>
                <span className="font-bold text-slate-800">
                  {tx.tokens > 0 ? `+${tx.tokens}` : tx.tokens} {t("tokens")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
