"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { AdminUsersTable } from "@/features/admin/components/AdminUsersTable";
import { useAdminUsers } from "@/hooks/useAdmin";

export default function AdminUsersPage() {
  const t = useTranslations("adminUsersPage");
  const { data, isLoading, isError, refetch } = useAdminUsers();

  if (isLoading) {
    return <div className="mx-auto max-w-[1100px] animate-pulse p-6"><div className="h-64 rounded-2xl bg-slate-100" /></div>;
  }

  if (isError) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-24 text-center">
        <p className="text-sm text-slate-500">{t("error")}</p>
        <Button onClick={() => void refetch()} className="rounded-full bg-[#0B1A2D] text-white">{t("retry")}</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-4 px-3 py-4 sm:px-6 sm:py-8">
      <header>
        <h1 className="text-xl font-black text-[#0B1A2D] sm:text-3xl">{t("title")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("subtitle", { count: data?.length ?? 0 })}</p>
      </header>
      <AdminUsersTable users={data ?? []} titleKey="usersTitleAll" />
    </div>
  );
}
