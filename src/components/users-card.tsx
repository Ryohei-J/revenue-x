"use client";

import { useMemo } from "react";
import { Users, UserCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getFinalSubscribersByPlan } from "@/lib/calc";
import type { MonthlyData, SimulationConfig } from "@/types";

type Props = {
  data: MonthlyData[];
  config: SimulationConfig;
};

export function UsersCard({ data, config }: Props) {
  const last = data.length > 0 ? data[data.length - 1] : null;
  const planSubscribers = useMemo(() => getFinalSubscribersByPlan(config), [config]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <Users className="h-4 w-4" />
          ユーザー数
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {/* 総ユーザー数 */}
          <li className="flex items-center gap-3">
            <Users className="h-5 w-5 shrink-0 text-muted-foreground" />
            <span className="flex-1 text-sm">期間末ユーザー数</span>
            <span className="text-sm font-semibold tabular-nums">
              {last !== null ? last.users.toLocaleString() : "—"}
              {last !== null && (
                <span className="ml-0.5 text-xs font-normal text-muted-foreground">人</span>
              )}
            </span>
          </li>

          {/* プラン別サブスク加入者数 */}
          {planSubscribers.length === 0 ? (
            <li className="flex items-center gap-3">
              <UserCheck className="h-5 w-5 shrink-0 text-muted-foreground" />
              <span className="flex-1 text-sm">期間末サブスク加入者数</span>
              <span className="text-sm font-semibold tabular-nums text-muted-foreground">—</span>
            </li>
          ) : (
            planSubscribers.map((plan, i) => (
              <li key={i} className="flex items-center gap-3">
                <UserCheck className="h-5 w-5 shrink-0 text-muted-foreground" />
                <span className="flex-1 text-sm">{plan.name}</span>
                <span className="text-sm font-semibold tabular-nums">
                  {plan.count.toLocaleString()}
                  <span className="ml-0.5 text-xs font-normal text-muted-foreground">人</span>
                </span>
              </li>
            ))
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
