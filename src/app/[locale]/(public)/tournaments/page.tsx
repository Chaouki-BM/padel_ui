import { useTranslations } from "next-intl";

export default function TournamentsPage() {
  const t = useTranslations("pages.public");
  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold">{t("tournaments")}</h1>
      <p className="mt-2 text-muted-foreground">Placeholder</p>
    </div>
  );
}
