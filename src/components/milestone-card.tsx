"use client";

import { CheckCircle2, Circle, Target } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { findIncomeMonth } from "@/lib/calc";
import type { MonthlyData } from "@/types";

const INCOME_MILESTONES = [
  { label: "月収¥50,000（副業レベル）", threshold: 50_000 },
  { label: "月収¥300,000（独立検討レベル）", threshold: 300_000 },
  { label: "月収¥1,000,000（法人化検討レベル）", threshold: 1_000_000 },
];

type Props = {
  data: MonthlyData[];
};

export function MilestoneCard({ data }: Props) {
  const milestones = INCOME_MILESTONES.map((m) => ({
    label: m.label,
    achievedMonth: findIncomeMonth(data, m.threshold),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <Target className="h-4 w-4" />
          マイルストーン
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
                  ? `${m.achievedMonth}ヶ月目達成`
                  : "未達成"}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
