"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  useCancelSubscription,
  useCreateSubscription,
  useMySubscriptions,
  useSubscriptionPlans,
} from "@/hooks/useSubscriptions";
import { getApiErrorMessage } from "@/lib/api-error-message";

export default function SubscriptionsPage() {
  const t = useTranslations("subscriptionsPage");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const plansQuery = useSubscriptionPlans();
  const mineQuery = useMySubscriptions();
  const create = useCreateSubscription();
  const cancel = useCancelSubscription();

  async function handleSubscribe(planCode: string) {
    try {
      const sub = await create.mutateAsync(planCode);
      if (sub.paymentId) {
        router.push(`/player/pay/${sub.paymentId}`);
        return;
      }
      toast.success(t("subscribed"));
      void mineQuery.refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err, tCommon("error")));
    }
  }

  async function handleCancel(id: string) {
    try {
      await cancel.mutateAsync(id);
      toast.success(t("cancelled"));
      void mineQuery.refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err, tCommon("error")));
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 sm:px-6">
      <header>
        <h1 className="text-2xl font-black text-[#0B1A2D]">{t("title")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>
      </header>

      <section className="rounded-2xl border border-slate-100 bg-white p-5">
        <h2 className="text-sm font-black text-[#0B1A2D]">{t("plans")}</h2>
        {plansQuery.isLoading ? (
          <p className="mt-3 text-sm text-slate-500">{tCommon("loading")}</p>
        ) : null}
        {plansQuery.isError ? (
          <Button
            type="button"
            variant="outline"
            className="mt-3"
            onClick={() => void plansQuery.refetch()}
          >
            {tCommon("errorRetry")}
          </Button>
        ) : null}
        <ul className="mt-3 space-y-3">
          {(plansQuery.data ?? []).map((plan) => (
            <li
              key={plan.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-4 py-3"
            >
              <div>
                <p className="font-bold text-[#0B1A2D]">{plan.name}</p>
                <p className="text-xs text-slate-500">
                  {plan.price} TND / {plan.interval}
                </p>
                {plan.description ? (
                  <p className="mt-1 text-xs text-slate-400">{plan.description}</p>
                ) : null}
              </div>
              <Button
                type="button"
                disabled={create.isPending}
                onClick={() => void handleSubscribe(plan.code)}
                className="rounded-xl bg-[#C0FF00] font-bold text-[#0B1A2D]"
              >
                {t("subscribe")}
              </Button>
            </li>
          ))}
        </ul>
        {!plansQuery.isLoading && (plansQuery.data ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">{t("noPlans")}</p>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-5">
        <h2 className="text-sm font-black text-[#0B1A2D]">{t("mine")}</h2>
        {(mineQuery.data ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">{t("noSubs")}</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {(mineQuery.data ?? []).map((sub) => (
              <li
                key={sub.id}
                className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="font-bold text-[#0B1A2D]">{sub.plan}</p>
                  <p className="text-xs text-slate-500">{sub.status}</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  disabled={cancel.isPending}
                  onClick={() => void handleCancel(sub.id)}
                  className="rounded-xl"
                >
                  {t("cancel")}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
