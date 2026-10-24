"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  useCompleteCoachBooking,
  useCoachSpaceRequests,
  useUpdateCoachSpaceRequest,
} from "@/hooks/useCoachSpace";
import { cn } from "@/lib/utils";

export default function CoachRequestsPage() {
  const t = useTranslations("coachSpaceRequests");
  const { data, isLoading, isError, refetch } = useCoachSpaceRequests();
  const updateRequest = useUpdateCoachSpaceRequest();
  const complete = useCompleteCoachBooking();

  async function handleAction(
    id: string,
    status: "accepted" | "declined",
    name: string,
  ) {
    try {
      await updateRequest.mutateAsync({ id, status });
      toast.success(
        status === "accepted"
          ? t("acceptedToast", { name })
          : t("declinedToast", { name }),
      );
    } catch {
      toast.error(t("actionError"));
    }
  }

  async function handleComplete(id: string, name: string) {
    try {
      await complete.mutateAsync(id);
      toast.success(t("completedToast", { name }));
    } catch {
      toast.error(t("actionError"));
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[900px] animate-pulse space-y-3 px-4 py-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-slate-100" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
        <p className="text-sm font-medium text-slate-500">{t("error")}</p>
        <Button
          onClick={() => void refetch()}
          className="rounded-full bg-[#0B1A2D] text-white"
        >
          {t("retry")}
        </Button>
      </div>
    );
  }

  const requests = data ?? [];
  const busy = updateRequest.isPending || complete.isPending;

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-4 px-3 py-4 sm:gap-6 sm:px-6 sm:py-8">
      <header>
        <h1 className="text-xl font-black text-[#0B1A2D] sm:text-3xl">
          {t("title")}
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-500">{t("subtitle")}</p>
      </header>

      {requests.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center text-sm font-medium text-slate-500">
          {t("empty")}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {requests.map((request) => (
            <li
              key={request.id}
              className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0B1A2D] text-xs font-black text-[#C0FF00]">
                    {request.clientInitials}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-[#0B1A2D]">
                        {request.clientName}
                      </p>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase">
                        {t(`types.${request.sessionType}`)}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-bold",
                          request.status === "pending" &&
                            "bg-amber-50 text-amber-700",
                          request.status === "accepted" &&
                            "bg-emerald-50 text-emerald-700",
                          request.status === "declined" &&
                            "bg-rose-50 text-rose-600",
                        )}
                      >
                        {t(`status.${request.status}`)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      {request.preferredDate} · {request.preferredTime} ·{" "}
                      {request.durationMinutes} min · {request.price} TND
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-600">
                      {request.message}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 gap-2 self-end sm:self-start">
                  {request.status === "pending" ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={busy}
                        onClick={() =>
                          void handleAction(
                            request.id,
                            "declined",
                            request.clientName,
                          )
                        }
                        className="h-10 rounded-xl border-rose-200 text-xs font-bold text-rose-600"
                      >
                        {t("decline")}
                      </Button>
                      <Button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          void handleAction(
                            request.id,
                            "accepted",
                            request.clientName,
                          )
                        }
                        className="h-10 rounded-xl bg-[#0B1A2D] text-xs font-bold text-[#C0FF00]"
                      >
                        {t("accept")}
                      </Button>
                    </>
                  ) : null}
                  {request.status === "accepted" ? (
                    <Button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        void handleComplete(request.id, request.clientName)
                      }
                      className="h-10 rounded-xl bg-[#0B1A2D] text-xs font-bold text-[#C0FF00]"
                    >
                      {t("complete")}
                    </Button>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
