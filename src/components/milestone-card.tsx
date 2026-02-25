"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2, Circle, Target } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { findIncomeMonth } from "@/lib/calc";
import type { MonthlyData } from "@/types";

const INCOME_MILESTONES = [
  { labelKey: "milestone1", threshold: 50_000 },
  { labelKey: "milestone2", threshold: 300_000 },
  { labelKey: "milestone3", threshold: 1_000_000 },
] as const;

type Props = {
  data: MonthlyData[];
};

export function MilestoneCard({ data }: Props) {
  const t = useTranslations("milestone");

  const milestones = INCOME_MILESTONES.map((m) => ({
    label: t(m.labelKey),
    achievedMonth: findIncomeMonth(data, m.threshold),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <Target className="h-4 w-4" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {milestones.map((m, i) => (
            <li key={i} className="flex items-center gap-3">
              {m.achievedMonth !== null ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500 dark:text-green-400" />
              ) : (
                <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
              )}
              <span className="flex-1 text-sm">{m.label}</span>
              <span
                className={cn(
                  "text-sm font-semibold tabular-nums",
                  m.achievedMonth !== null
                    ? "text-green-600 dark:text-green-400"
                    : "text-muted-foreground"
                )}
              >
                {m.achievedMonth !== null
                  ? t("achieved", { month: m.achievedMonth })
                  : t("notAchieved")}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
