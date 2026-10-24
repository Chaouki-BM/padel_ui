"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api-error-message";
import { formatTunisDate } from "@/lib/format";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "@/hooks/useMe";

export default function NotificationsPage() {
  const t = useTranslations("notificationsPage");
  const tCommon = useTranslations("common");
  const { data, isLoading, isError, refetch } = useNotifications(false);
  const markOne = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  async function handleMarkAll() {
    try {
      await markAll.mutateAsync();
      toast.success(t("markedAll"));
    } catch (err) {
      toast.error(getApiErrorMessage(err, tCommon("error")));
    }
  }

  async function handleMarkOne(id: string) {
    try {
      await markOne.mutateAsync(id);
    } catch (err) {
      toast.error(getApiErrorMessage(err, tCommon("error")));
    }
  }

  if (isLoading) {
    return (
      <div className="px-4 py-8 text-sm font-medium text-slate-500">
        {tCommon("loading")}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-start gap-3 px-4 py-8">
        <p className="text-sm font-medium text-red-600">{tCommon("error")}</p>
        <Button type="button" variant="outline" onClick={() => void refetch()}>
          {tCommon("errorRetry")}
        </Button>
      </div>
    );
  }

  const items = data?.items ?? [];
  const unread = data?.unreadCount ?? 0;

  return (
    <div className="mx-auto flex w-full max-w-[800px] flex-col gap-6 px-4 py-6 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#0B1A2D]">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {t("unread", { count: unread })}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={markAll.isPending || unread === 0}
          onClick={() => void handleMarkAll()}
          className="rounded-xl"
        >
          {t("markAll")}
        </Button>
      </header>

      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-500">
          {t("empty")}
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((n) => {
            const title = n.title ?? n.type ?? t("untitled");
            const body = n.body ?? n.message ?? "";
            const unreadItem = !n.readAt;
            return (
              <li
                key={n.id}
                className={`rounded-2xl border bg-white p-4 shadow-sm ${
                  unreadItem ? "border-[#C0FF00]/60" : "border-slate-100"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-bold text-[#0B1A2D]">{title}</p>
                    {body ? (
                      <p className="mt-1 text-sm text-slate-600">{body}</p>
                    ) : null}
                    {n.createdAt ? (
                      <p className="mt-2 text-xs text-slate-400">
                        {formatTunisDate(n.createdAt)}
                      </p>
                    ) : null}
                  </div>
                  {unreadItem ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="rounded-lg"
                      disabled={markOne.isPending}
                      onClick={() => void handleMarkOne(n.id)}
                    >
                      {t("markRead")}
                    </Button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
