"use client";

import { useTranslations } from "next-intl";
import { Plus, Trash2, CreditCard, Megaphone } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SubscriptionItem, AdItem } from "@/types";

type Props = {
  subscriptions: SubscriptionItem[];
  ads: AdItem[];
  onAddSubscription: () => void;
  onUpdateSubscription: (
    id: string,
    field: "name" | "amount" | "conversionRate" | "churnRate",
    value: string | number
  ) => void;
  onRemoveSubscription: (id: string) => void;
  onAddAd: () => void;
  onUpdateAd: (
    id: string,
    field: "name" | "amount",
    value: string | number
  ) => void;
  onRemoveAd: (id: string) => void;
};

export function IncomeCard({
  subscriptions,
  ads,
  onAddSubscription,
  onUpdateSubscription,
  onRemoveSubscription,
  onAddAd,
  onUpdateAd,
  onRemoveAd,
}: Props) {
  const t = useTranslations("income");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* サブスクセクション */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
            <CreditCard className="h-3.5 w-3.5" />
            {t("subscriptionTitle")}
          </h3>
          {subscriptions.map((item) => (
            <div
              key={item.id}
              className="space-y-2 rounded-md border p-3"
            >
              <div className="flex items-center gap-2">
                <Input
                  placeholder={t("subscriptionNamePlaceholder")}
                  value={item.name}
                  onChange={(e) =>
                    onUpdateSubscription(item.id, "name", e.target.value)
                  }
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder={t("subscriptionAmountPlaceholder")}
                  value={item.amount || ""}
                  onChange={(e) =>
                    onUpdateSubscription(
                      item.id,
                      "amount",
                      Number(e.target.value) || 0
                    )
                  }
                  className="w-32"
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {t("perSubscriberMonth")}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveSubscription(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">
                    {t("conversionRate")}
                  </Label>
                  <Input
                    type="number"
                    step={0.1}
                    min={0}
                    max={100}
                    value={item.conversionRate}
                    onChange={(e) =>
                      onUpdateSubscription(
                        item.id,
                        "conversionRate",
                        Number(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">
                    {t("churnRate")}
                  </Label>
                  <Input
                    type="number"
                    step={0.1}
                    min={0}
                    max={100}
                    value={item.churnRate}
                    onChange={(e) =>
                      onUpdateSubscription(
                        item.id,
                        "churnRate",
                        Number(e.target.value) || 0
                      )
                    }
                  />
                </div>
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={onAddSubscription}
            className="w-full"
          >
            <Plus className="mr-1 h-4 w-4" />
            {t("addSubscriptionButton")}
          </Button>
        </div>

        {/* 広告セクション */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
            <Megaphone className="h-3.5 w-3.5" />
            {t("adTitle")}
          </h3>
          {ads.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <Input
                placeholder={t("adNamePlaceholder")}
                value={item.name}
                onChange={(e) => onUpdateAd(item.id, "name", e.target.value)}
                className="flex-1"
              />
              <Input
                type="number"
                placeholder={t("adAmountPlaceholder")}
                value={item.amount || ""}
                onChange={(e) =>
                  onUpdateAd(item.id, "amount", Number(e.target.value) || 0)
                }
                className="w-32"
              />
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {t("perUserMonth")}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveAd(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={onAddAd}
            className="w-full"
          >
            <Plus className="mr-1 h-4 w-4" />
            {t("addAdButton")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
