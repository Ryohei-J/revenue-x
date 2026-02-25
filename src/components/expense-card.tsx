"use client";

import { useTranslations } from "next-intl";
import { Plus, Trash2, PackagePlus, Building2, Users, Percent } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CurrencyToggle } from "@/components/currency-toggle";
import { BillingCycleToggle } from "@/components/billing-cycle-toggle";
import type {
  InitialCostItem,
  FixedExpenseItem,
  VariableExpenseItem,
  TransactionFeeItem,
} from "@/types";

type Props = {
  initialCosts: InitialCostItem[];
  fixedExpenses: FixedExpenseItem[];
  variableExpenses: VariableExpenseItem[];
  transactionFees: TransactionFeeItem[];
  onAddInitialCost: () => void;
  onUpdateInitialCost: (
    id: string,
    field: "name" | "amount" | "currency",
    value: string | number
  ) => void;
  onRemoveInitialCost: (id: string) => void;
  onAddFixed: () => void;
  onUpdateFixed: (
    id: string,
    field: "name" | "amount" | "currency" | "billingCycle",
    value: string | number
  ) => void;
  onRemoveFixed: (id: string) => void;
  onAddVariable: () => void;
  onUpdateVariable: (
    id: string,
    field: "name" | "amount" | "currency" | "billingCycle",
    value: string | number
  ) => void;
  onRemoveVariable: (id: string) => void;
  onAddTransactionFee: () => void;
  onUpdateTransactionFee: (
    id: string,
    field: "name" | "rate",
    value: string | number
  ) => void;
  onRemoveTransactionFee: (id: string) => void;
};

export function ExpenseCard({
  initialCosts,
  fixedExpenses,
  variableExpenses,
  transactionFees,
  onAddInitialCost,
  onUpdateInitialCost,
  onRemoveInitialCost,
  onAddFixed,
  onUpdateFixed,
  onRemoveFixed,
  onAddVariable,
  onUpdateVariable,
  onRemoveVariable,
  onAddTransactionFee,
  onUpdateTransactionFee,
  onRemoveTransactionFee,
}: Props) {
  const t = useTranslations("expense");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* 初期費用セクション */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
            <PackagePlus className="h-3.5 w-3.5" />
            {t("initialCostTitle")}
          </h3>
          {initialCosts.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <Input
                placeholder={t("initialCostNamePlaceholder")}
                value={item.name}
                onChange={(e) =>
                  onUpdateInitialCost(item.id, "name", e.target.value)
                }
                className="flex-1"
              />
              <CurrencyToggle
                currency={item.currency}
                onChange={(c) => onUpdateInitialCost(item.id, "currency", c)}
              />
              <Input
                type="number"
                placeholder={t("initialCostAmountPlaceholder")}
                value={item.amount || ""}
                onChange={(e) =>
                  onUpdateInitialCost(
                    item.id,
                    "amount",
                    Number(e.target.value) || 0
                  )
                }
                className="w-24"
              />
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {t("oneTime")}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveInitialCost(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={onAddInitialCost}
            className="w-full"
          >
            <Plus className="mr-1 h-4 w-4" />
            {t("addInitialCostButton")}
          </Button>
        </div>

        {/* 固定費セクション */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
            <Building2 className="h-3.5 w-3.5" />
            {t("fixedTitle")}
          </h3>
          {fixedExpenses.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <Input
                placeholder={t("namePlaceholder")}
                value={item.name}
                onChange={(e) => onUpdateFixed(item.id, "name", e.target.value)}
                className="flex-1"
              />
              <CurrencyToggle
                currency={item.currency}
                onChange={(c) => onUpdateFixed(item.id, "currency", c)}
              />
              <Input
                type="number"
                placeholder={t("amountPlaceholder")}
                value={item.amount || ""}
                onChange={(e) =>
                  onUpdateFixed(item.id, "amount", Number(e.target.value) || 0)
                }
                className="w-24"
              />
              <BillingCycleToggle
                billingCycle={item.billingCycle}
                onChange={(bc) => onUpdateFixed(item.id, "billingCycle", bc)}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveFixed(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={onAddFixed}
            className="w-full"
          >
            <Plus className="mr-1 h-4 w-4" />
            {t("addFixedButton")}
          </Button>
        </div>

        {/* 変動費セクション */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            {t("variableTitle")}
          </h3>
          {variableExpenses.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <Input
                placeholder={t("variableNamePlaceholder")}
                value={item.name}
                onChange={(e) =>
                  onUpdateVariable(item.id, "name", e.target.value)
                }
                className="flex-1"
              />
              <CurrencyToggle
                currency={item.currency}
                onChange={(c) => onUpdateVariable(item.id, "currency", c)}
              />
              <Input
                type="number"
                placeholder={t("variableAmountPlaceholder")}
                value={item.amount || ""}
                onChange={(e) =>
                  onUpdateVariable(
                    item.id,
                    "amount",
                    Number(e.target.value) || 0
                  )
                }
                className="w-24"
              />
              <BillingCycleToggle
                billingCycle={item.billingCycle}
                onChange={(bc) => onUpdateVariable(item.id, "billingCycle", bc)}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveVariable(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={onAddVariable}
            className="w-full"
          >
            <Plus className="mr-1 h-4 w-4" />
            {t("addVariableButton")}
          </Button>
        </div>

        {/* 決済手数料セクション */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
            <Percent className="h-3.5 w-3.5" />
            {t("transactionFeeTitle")}
          </h3>
          {transactionFees.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <Input
                placeholder={t("transactionFeeNamePlaceholder")}
                value={item.name}
                onChange={(e) =>
                  onUpdateTransactionFee(item.id, "name", e.target.value)
                }
                className="flex-1"
              />
              <Input
                type="number"
                placeholder={t("transactionFeeRatePlaceholder")}
                value={item.rate || ""}
                onChange={(e) =>
                  onUpdateTransactionFee(
                    item.id,
                    "rate",
                    Number(e.target.value) || 0
                  )
                }
                className="w-24"
                step={0.1}
                min={0}
                max={100}
              />
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {t("feePercent")}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveTransactionFee(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={onAddTransactionFee}
            className="w-full"
          >
            <Plus className="mr-1 h-4 w-4" />
            {t("addTransactionFeeButton")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
