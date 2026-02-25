"use client";

import { useTranslations } from "next-intl";
import { Plus, Trash2, CreditCard, Megaphone, ShoppingCart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencyToggle } from "@/components/currency-toggle";
import { BillingCycleToggle } from "@/components/billing-cycle-toggle";
import type { SubscriptionItem, AdItem, OneTimePurchaseItem } from "@/types";

type Props = {
  subscriptions: SubscriptionItem[];
  ads: AdItem[];
  oneTimePurchases: OneTimePurchaseItem[];
  onAddSubscription: () => void;
  onUpdateSubscription: (
    id: string,
    field: "name" | "amount" | "currency" | "billingCycle" | "conversionRate" | "churnRate",
    value: string | number
  ) => void;
  onRemoveSubscription: (id: string) => void;
  onAddAd: () => void;
  onUpdateAd: (
    id: string,
    field: "name" | "amount" | "currency" | "billingCycle",
    value: string | number
  ) => void;
  onRemoveAd: (id: string) => void;
  onAddOneTimePurchase: () => void;
  onUpdateOneTimePurchase: (
    id: string,
    field: "name" | "amount" | "currency" | "conversionRate",
    value: string | number
  ) => void;
  onRemoveOneTimePurchase: (id: string) => void;
};

export function IncomeCard({
  subscriptions,
  ads,
  oneTimePurchases,
  onAddSubscription,
  onUpdateSubscription,
  onRemoveSubscription,
  onAddAd,
  onUpdateAd,
  onRemoveAd,
  onAddOneTimePurchase,
  onUpdateOneTimePurchase,
  onRemoveOneTimePurchase,
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
                <CurrencyToggle
                  currency={item.currency}
                  onChange={(c) => onUpdateSubscription(item.id, "currency", c)}
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
                  className="w-24"
                />
                <BillingCycleToggle
                  billingCycle={item.billingCycle}
                  onChange={(bc) => onUpdateSubscription(item.id, "billingCycle", bc)}
                />
              </div>
              <div className="flex items-end gap-3">
                <div className="flex-1 space-y-1">
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
                <div className="flex-1 space-y-1">
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  onClick={() => onRemoveSubscription(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
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

        {/* 買い切りセクション */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
            <ShoppingCart className="h-3.5 w-3.5" />
            {t("oneTimePurchaseTitle")}
          </h3>
          {oneTimePurchases.map((item) => (
            <div key={item.id} className="space-y-2 rounded-md border p-3">
              <div className="flex items-center gap-2">
                <Input
                  placeholder={t("oneTimePurchaseNamePlaceholder")}
                  value={item.name}
                  onChange={(e) =>
                    onUpdateOneTimePurchase(item.id, "name", e.target.value)
                  }
                  className="flex-1"
                />
                <CurrencyToggle
                  currency={item.currency}
                  onChange={(c) => onUpdateOneTimePurchase(item.id, "currency", c)}
                />
                <Input
                  type="number"
                  placeholder={t("oneTimePurchaseAmountPlaceholder")}
                  value={item.amount || ""}
                  onChange={(e) =>
                    onUpdateOneTimePurchase(
                      item.id,
                      "amount",
                      Number(e.target.value) || 0
                    )
                  }
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {t("perSale")}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveOneTimePurchase(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t("purchaseConversionRate")}</Label>
                <Input
                  type="number"
                  step={0.1}
                  min={0}
                  max={100}
                  value={item.conversionRate}
                  onChange={(e) =>
                    onUpdateOneTimePurchase(
                      item.id,
                      "conversionRate",
                      Number(e.target.value) || 0
                    )
                  }
                />
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={onAddOneTimePurchase}
            className="w-full"
          >
            <Plus className="mr-1 h-4 w-4" />
            {t("addOneTimePurchaseButton")}
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
              <CurrencyToggle
                currency={item.currency}
                onChange={(c) => onUpdateAd(item.id, "currency", c)}
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
              <BillingCycleToggle
                billingCycle={item.billingCycle}
                onChange={(bc) => onUpdateAd(item.id, "billingCycle", bc)}
              />
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
