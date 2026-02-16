"use client";

import { useTranslations } from "next-intl";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { MonthlyData } from "@/types";

type Props = {
  data: MonthlyData[];
};

export function ChartCard({ data }: Props) {
  const t = useTranslations("chart");

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
              label={{
                value: t("amount"),
                angle: -90,
                position: "insideLeft",
              }}
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
              stackId="1"
              fill="hsl(0 84% 60%)"
              stroke="hsl(0 84% 60%)"
              fillOpacity={0.4}
            />
            <Area
              type="monotone"
              dataKey="totalIncome"
              name={t("income")}
              stackId="1"
              fill="hsl(221 83% 53%)"
              stroke="hsl(221 83% 53%)"
              fillOpacity={0.4}
            />
            <Line
              type="monotone"
              dataKey="cumulativeProfit"
              name={t("cumulativeProfit")}
              stroke="hsl(142 71% 45%)"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
