"use client";

import { CheckCircle2, Circle, Target } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Milestone = {
  label: string;
  achievedMonth: number | null;
};

// TODO: compute dynamically from simulation data
const MILESTONES: Milestone[] = [
  { label: "サーバー代を自給自足", achievedMonth: 3 },
  { label: "月5万円（副業お小遣いレベル）", achievedMonth: 8 },
  { label: "月30万円（独立検討レベル）", achievedMonth: null },
];

export function MilestoneCard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <Target className="h-4 w-4" />
          マイルストーン
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {MILESTONES.map((m, i) => (
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
