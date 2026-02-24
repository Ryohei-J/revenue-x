"use client";

import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const USERS_PRESETS = [100, 500, 1000, 5000] as const;
const PERIOD_PRESETS = [6, 12, 24, 36] as const;
const GROWTH_PRESETS = [3, 5, 10, 20] as const;

type Props = {
  periodMonths: number;
  monthlyGrowthRate: number;
  initialUsers: number;
  onPeriodChange: (months: number) => void;
  onGrowthRateChange: (rate: number) => void;
  onInitialUsersChange: (users: number) => void;
};

export function PeriodCard({
  periodMonths,
  monthlyGrowthRate,
  initialUsers,
  onPeriodChange,
  onGrowthRateChange,
  onInitialUsersChange,
}: Props) {
  const t = useTranslations("period");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="initialUsers">{t("initialUsers")}</Label>
          <div className="flex items-center gap-2">
            <Input
              id="initialUsers"
              type="number"
              min={0}
              value={initialUsers}
              onChange={(e) => onInitialUsersChange(Number(e.target.value) || 0)}
              className="w-20 shrink-0"
            />
            <div className="h-6 w-px shrink-0 bg-border" />
            {USERS_PRESETS.map((u) => (
              <Button
                key={u}
                variant={initialUsers === u ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => onInitialUsersChange(u)}
              >
                {u >= 1000 ? `${u / 1000}k` : u}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="periodMonths">{t("months")}</Label>
          <div className="flex items-center gap-2">
            <Input
              id="periodMonths"
              type="number"
              min={1}
              max={120}
              value={periodMonths}
              onChange={(e) => onPeriodChange(Number(e.target.value) || 1)}
              className="w-20 shrink-0"
            />
            <div className="h-6 w-px shrink-0 bg-border" />
            {PERIOD_PRESETS.map((m) => (
              <Button
                key={m}
                variant={periodMonths === m ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => onPeriodChange(m)}
              >
                {m}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="growthRate">{t("growthRate")}</Label>
          <div className="flex items-center gap-2">
            <Input
              id="growthRate"
              type="number"
              step={0.1}
              min={-100}
              max={1000}
              value={monthlyGrowthRate}
              onChange={(e) => onGrowthRateChange(Number(e.target.value) || 0)}
              className="w-20 shrink-0"
            />
            <div className="h-6 w-px shrink-0 bg-border" />
            {GROWTH_PRESETS.map((g) => (
              <Button
                key={g}
                variant={monthlyGrowthRate === g ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => onGrowthRateChange(g)}
              >
                {g}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
