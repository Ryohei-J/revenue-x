"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { findBreakEvenMonth } from "@/lib/calc";
import type { MonthlyData } from "@/types";

type Props = {
  data: MonthlyData[];
};

export function ChartCard({ data }: Props) {
  const t = useTranslations("chart");
  const bepMonth = useMemo(() => findBreakEvenMonth(data), [data]);
  const currencyPrefix = t("currencyPrefix");
  const userSuffix = t("userSuffix");
  const unitSmall = t("unitSmall");
  const unitSmallDiv = Number(t("unitSmallDivisor"));
  const unitLarge = t("unitLarge");
  const unitLargeDiv = Number(t("unitLargeDivisor"));
  const compactThreshold = Number(t("compactThreshold"));

  function formatCompact(v: number) {
    const abs = Math.abs(v);
    if (abs >= unitLargeDiv) {
      const n = abs / unitLargeDiv;
      return { n: Number.isInteger(n) ? String(n) : n.toFixed(1), unit: unitLarge };
    }
    if (abs >= unitSmallDiv) {
      const n = abs / unitSmallDiv;
      return { n: Number.isInteger(n) ? String(n) : n.toFixed(1), unit: unitSmall };
    }
    return { n: abs.toLocaleString(), unit: "" };
  }

  function formatCurrency(v: number) {
    const sign = v < 0 ? "-" : "";
    const abs = Math.abs(v);
    if (abs >= compactThreshold) {
      const { n, unit } = formatCompact(v);
      return `${sign}${currencyPrefix}${n}${unit}`;
    }
    return `${sign}${currencyPrefix}${abs.toLocaleString()}`;
  }

  function formatUsers(v: number) {
    const { n, unit } = formatCompact(v);
    return `${n}${unit}${userSuffix}`;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={data} margin={{ top: 20, right: 60, left: 20 }}>
            <defs>
              <linearGradient id="gradExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0 84% 60%)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="hsl(0 84% 60%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#335BA5" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#335BA5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142 71% 45%)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="hsl(142 71% 45%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(271 76% 53%)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="hsl(271 76% 53%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              type="number"
              domain={["dataMin", "dataMax"]}
              ticks={data.map((d) => d.month)}
            />
            <YAxis yAxisId="left" tickFormatter={formatCurrency} />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={formatUsers}
            />
            <Tooltip
              formatter={(value) =>
                typeof value === "number" ? value.toLocaleString() : value
              }
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="totalExpense"
              name={t("expense")}
              stroke="hsl(0 84% 60%)"
              strokeWidth={2}
              fill="url(#gradExpense)"
              dot={false}
              yAxisId="left"
            />
            <Area
              type="monotone"
              dataKey="totalIncome"
              name={t("income")}
              stroke="#335BA5"
              strokeWidth={2}
              fill="url(#gradIncome)"
              dot={false}
              yAxisId="left"
            />
            <Area
              type="monotone"
              dataKey="cumulativeProfit"
              name={t("cumulativeProfit")}
              stroke="hsl(142 71% 45%)"
              strokeWidth={2}
              fill="url(#gradProfit)"
              dot={false}
              yAxisId="left"
            />
            <Area
              type="monotone"
              dataKey="users"
              name={t("users")}
              stroke="hsl(271 76% 53%)"
              strokeWidth={2}
              fill="url(#gradUsers)"
              dot={false}
              yAxisId="right"
            />
            <ReferenceLine
              y={0}
              yAxisId="left"
              stroke="var(--muted-foreground)"
              strokeDasharray="4 4"
            />
            {bepMonth !== null && (
              <ReferenceLine
                x={bepMonth}
                yAxisId="left"
                stroke="hsl(45 93% 47%)"
                strokeDasharray="4 4"
                strokeWidth={2}
                label={{
                  value: t("bep"),
                  position: "top",
                  fill: "hsl(45 93% 47%)",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
