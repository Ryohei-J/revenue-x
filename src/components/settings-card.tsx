"use client";

import { useTranslations } from "next-intl";
import { Settings, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Props = {
  exchangeRate: number;
  onExchangeRateChange: (rate: number) => void;
  onRefresh: () => void;
};

export function SettingsCard({
  exchangeRate,
  onExchangeRateChange,
  onRefresh,
}: Props) {
  const t = useTranslations("settings");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <Settings className="h-4 w-4" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label className="text-sm">{t("exchangeRateLabel")}</Label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              1 USD =
            </span>
            <Input
              type="number"
              step={0.01}
              min={0}
              value={exchangeRate}
              onChange={(e) =>
                onExchangeRateChange(Number(e.target.value) || 0)
              }
              className="w-28"
            />
            <span className="text-sm text-muted-foreground">JPY</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              title={t("refreshTooltip")}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("exchangeRateDescription")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
