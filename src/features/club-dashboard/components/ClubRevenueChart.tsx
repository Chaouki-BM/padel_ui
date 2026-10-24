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
import { type ClubRevenuePoint } from "@/types";

type ClubRevenueChartProps = {
  series: ClubRevenuePoint[];
  goal: number;
};

export function ClubRevenueChart({ series, goal }: ClubRevenueChartProps) {
  const t = useTranslations("clubDashboard");

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-black text-[#0B1A2D]">
          {t("revenueTitle")}
        </h2>
        <span className="rounded-full bg-[#F3FFCC] px-3 py-1 text-[11px] font-bold text-[#0B1A2D]">
          {t("goal", { amount: goal.toLocaleString("fr-TN") })}
        </span>
      </div>
      <div className="h-56 w-full sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series}>
            <defs>
              <linearGradient id="resFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0B1A2D" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0B1A2D" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="shopFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C0FF00" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#C0FF00" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} width={40} />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="reservations"
              name={t("series.reservations")}
              stroke="#0B1A2D"
              fill="url(#resFill)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="shop"
              name={t("series.shop")}
              stroke="#84cc16"
              fill="url(#shopFill)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
