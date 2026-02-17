"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  ComposedChart,
  Line,
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              label={{ value: t("month"), position: "insideBottom", offset: -5 }}
            />
            <YAxis
              yAxisId="left"
              label={{
                value: t("amount"),
                angle: -90,
                position: "insideLeft",
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{
                value: t("users"),
                angle: 90,
                position: "insideRight",
              }}
            />
            <Tooltip
              formatter={(value) =>
                typeof value === "number" ? value.toLocaleString() : value
              }
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalExpense"
              name={t("expense")}
              stroke="hsl(0 84% 60%)"
              strokeWidth={2}
              dot={false}
              yAxisId="left"
            />
            <Line
              type="monotone"
              dataKey="totalIncome"
              name={t("income")}
              stroke="hsl(221 83% 53%)"
              strokeWidth={2}
              dot={false}
              yAxisId="left"
            />
            <Line
              type="monotone"
              dataKey="cumulativeProfit"
              name={t("cumulativeProfit")}
              stroke="hsl(142 71% 45%)"
              strokeWidth={2}
              dot={false}
              yAxisId="left"
            />
            <Line
              type="monotone"
              dataKey="users"
              name={t("users")}
              stroke="hsl(271 76% 53%)"
              strokeWidth={2}
              strokeDasharray="5 3"
              dot={false}
              yAxisId="right"
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
