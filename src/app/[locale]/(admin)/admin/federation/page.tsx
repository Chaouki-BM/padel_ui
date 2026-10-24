"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useCreateFederationImport,
  useFederationImports,
} from "@/hooks/useAdmin";

export default function AdminFederationPage() {
  const t = useTranslations("adminFederationPage");
  const { data, isLoading, isError, refetch } = useFederationImports();
  const createImport = useCreateFederationImport();
  const [fileName, setFileName] = useState("licences.xlsx");
  const [dryRun, setDryRun] = useState(true);

  async function onImport() {
    try {
      await createImport.mutateAsync({
        dryRun,
        fileName: fileName.trim() || "licences.xlsx",
      });
      toast.success(dryRun ? t("dryRunOk") : t("importOk"));
    } catch {
      toast.error(t("importError"));
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[800px] animate-pulse space-y-3 p-6">
        <div className="h-40 rounded-2xl bg-slate-100" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-24 text-center">
        <p className="text-sm text-slate-500">{t("error")}</p>
        <Button onClick={() => void refetch()} className="rounded-full bg-[#0B1A2D] text-white">
          {t("retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[800px] flex-col gap-4 px-3 py-4 sm:px-6 sm:py-8">
      <header>
        <h1 className="text-xl font-black text-[#0B1A2D] sm:text-3xl">{t("title")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>
      </header>

      <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <Input
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder={t("filePlaceholder")}
          className="h-11"
        />
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={dryRun}
            onChange={(e) => setDryRun(e.target.checked)}
          />
          {t("dryRun")}
        </label>
        <Button
          type="button"
          disabled={createImport.isPending}
          onClick={() => void onImport()}
          className="h-11 rounded-xl bg-[#0B1A2D] text-[#C0FF00]"
        >
          {t("import")}
        </Button>
      </div>

      {(data ?? []).length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-500">
          {t("empty")}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {data!.map((row) => (
            <li
              key={row.id}
              className="rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
            >
              <p className="text-sm font-bold text-[#0B1A2D]">{row.fileName}</p>
              <p className="text-xs text-slate-500">
                {row.createdAt} · {row.rows} rows · {row.status}
                {row.dryRun ? ` · ${t("dryRunBadge")}` : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
