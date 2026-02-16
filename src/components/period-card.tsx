"use client";

import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  periodMonths: number;
  monthlyGrowthRate: number;
  onPeriodChange: (months: number) => void;
  onGrowthRateChange: (rate: number) => void;
};

export function PeriodCard({
  periodMonths,
  monthlyGrowthRate,
  onPeriodChange,
  onGrowthRateChange,
}: Props) {
  const t = useTranslations("period");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="periodMonths">{t("months")}</Label>
          <Input
            id="periodMonths"
            type="number"
            min={1}
            max={120}
            value={periodMonths}
            onChange={(e) => onPeriodChange(Number(e.target.value) || 1)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="growthRate">{t("growthRate")}</Label>
          <Input
            id="growthRate"
            type="number"
            step={0.1}
            value={monthlyGrowthRate}
            onChange={(e) => onGrowthRateChange(Number(e.target.value) || 0)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
