"use client";

import { useTranslations } from "next-intl";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { type AdminGrowthPoint } from "@/types";

type AdminGrowthChartProps = {
  series: AdminGrowthPoint[];
};

export function AdminGrowthChart({ series }: AdminGrowthChartProps) {
  const t = useTranslations("adminDashboard");

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
      <h2 className="mb-4 text-base font-black text-[#0B1A2D]">
        {t("growthTitle")}
      </h2>
      <div className="h-56 w-full sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series}>
            <defs>
              <linearGradient id="adminRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0B1A2D" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0B1A2D" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="adminRes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C0FF00" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#C0FF00" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} width={44} />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="revenue"
              name={t("series.revenue")}
              stroke="#0B1A2D"
              fill="url(#adminRev)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="reservations"
              name={t("series.reservations")}
              stroke="#84cc16"
              fill="url(#adminRes)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
