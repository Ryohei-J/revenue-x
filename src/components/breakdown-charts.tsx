"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { calculateBreakdown } from "@/lib/calc";
import type { SimulationConfig } from "@/types";

type Props = {
  config: SimulationConfig | null;
};

const EXPENSE_COLORS = [
  "hsl(30 80% 55%)",   // 初期費用: orange
  "hsl(0 84% 60%)",    // 固定費: red
  "hsl(271 76% 53%)",  // 変動費: purple
  "hsl(340 80% 55%)",  // 決済手数料: pink
];

const INCOME_COLORS = [
  "#335BA5",            // サブスク: brand blue
  "hsl(142 71% 45%)",  // 広告: green
];

export function BreakdownCharts({ config }: Props) {
  const t = useTranslations("breakdown");

  const breakdown = useMemo(
    () => (config ? calculateBreakdown(config) : null),
    [config]
  );

  const expenseData = breakdown
    ? [
        { name: t("initialCost"), value: breakdown.expense.initialCost },
        { name: t("fixedExpense"), value: breakdown.expense.fixedExpense },
        { name: t("variableExpense"), value: breakdown.expense.variableExpense },
        { name: t("transactionFee"), value: breakdown.expense.transactionFee },
      ].filter((d) => d.value > 0)
    : [];

  const incomeData = breakdown
    ? [
        { name: t("subscription"), value: breakdown.income.subscription },
        { name: t("ad"), value: breakdown.income.ad },
      ].filter((d) => d.value > 0)
    : [];

  const hasExpense = expenseData.length > 0;
  const hasIncome = incomeData.length > 0;

  function formatTooltip(value: number) {
    return `¥${value.toLocaleString()}`;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("expenseTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          {hasExpense ? (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart margin={{ top: 0, bottom: 0 }}>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy={49}
                  innerRadius={28}
                  outerRadius={46}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {expenseData.map((_, index) => (
                    <Cell
                      key={`expense-cell-${index}`}
                      fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatTooltip(value)} />
                <Legend
                  verticalAlign="bottom"
                  iconSize={10}
                  wrapperStyle={{ paddingTop: "6px", fontSize: "13px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[180px] items-center justify-center text-sm text-muted-foreground">
              {t("noData")}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("incomeTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          {hasIncome ? (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart margin={{ top: 0, bottom: 0 }}>
                <Pie
                  data={incomeData}
                  cx="50%"
                  cy={49}
                  innerRadius={28}
                  outerRadius={46}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {incomeData.map((_, index) => (
                    <Cell
                      key={`income-cell-${index}`}
                      fill={INCOME_COLORS[index % INCOME_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatTooltip(value)} />
                <Legend
                  verticalAlign="bottom"
                  iconSize={10}
                  wrapperStyle={{ paddingTop: "6px", fontSize: "13px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[180px] items-center justify-center text-sm text-muted-foreground">
              {t("noData")}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
