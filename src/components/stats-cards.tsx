"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { findBreakEvenMonth, getMaxCumulativeDeficit } from "@/lib/calc";
import type { MonthlyData } from "@/types";

type Props = {
  data: MonthlyData[];
};

function formatCurrency(value: number): string {
  return `¥${Math.abs(value).toLocaleString()}`;
}

export function StatsCards({ data }: Props) {
  const t = useTranslations("stats");

  const bepMonth = useMemo(() => findBreakEvenMonth(data), [data]);
  const maxDeficit = useMemo(() => getMaxCumulativeDeficit(data), [data]);

  const noData = data.length === 0;

  // 損益分岐点の表示値
  const bepDisplay = noData
    ? t("noData")
    : bepMonth !== null
      ? `${Math.ceil(bepMonth)}${t("bep.monthSuffix")}`
      : t("bep.notReached");

  // 累積赤字の表示値（最小累計損益の絶対値）
  const deficitValue = maxDeficit !== null ? Math.min(0, maxDeficit) : null;
  const deficitDisplay = noData
    ? t("noData")
    : deficitValue !== null && deficitValue < 0
      ? formatCurrency(deficitValue)
      : "¥0";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* 損益分岐点 */}
      <Card>
        <CardHeader>
          <CardDescription>{t("bep.label")}</CardDescription>
          <CardTitle
            className={cn(
              "text-2xl font-bold tabular-nums",
              noData
                ? "text-muted-foreground"
                : bepMonth !== null
                  ? "text-green-600 dark:text-green-400"
                  : "text-amber-600 dark:text-amber-400"
            )}
          >
            {bepDisplay}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">{t("bep.description")}</p>
        </CardContent>
      </Card>

      {/* 累積赤字 */}
      <Card>
        <CardHeader>
          <CardDescription>{t("maxDeficit.label")}</CardDescription>
          <CardTitle
            className={cn(
              "text-2xl font-bold tabular-nums",
              noData
                ? "text-muted-foreground"
                : deficitValue !== null && deficitValue < 0
                  ? "text-red-600 dark:text-red-400"
                  : "text-green-600 dark:text-green-400"
            )}
          >
            {deficitDisplay}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            {t("maxDeficit.description")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
