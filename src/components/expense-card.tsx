"use client";

import { useTranslations } from "next-intl";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FixedExpenseItem, VariableExpenseItem } from "@/types";

type Props = {
  fixedExpenses: FixedExpenseItem[];
  variableExpenses: VariableExpenseItem[];
  onAddFixed: () => void;
  onUpdateFixed: (
    id: string,
    field: "name" | "amount",
    value: string | number
  ) => void;
  onRemoveFixed: (id: string) => void;
  onAddVariable: () => void;
  onUpdateVariable: (
    id: string,
    field: "name" | "amount",
    value: string | number
  ) => void;
  onRemoveVariable: (id: string) => void;
};

export function ExpenseCard({
  fixedExpenses,
  variableExpenses,
  onAddFixed,
  onUpdateFixed,
  onRemoveFixed,
  onAddVariable,
  onUpdateVariable,
  onRemoveVariable,
}: Props) {
  const t = useTranslations("expense");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* 固定費セクション */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
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
              <Input
                type="number"
                placeholder={t("amountPlaceholder")}
                value={item.amount || ""}
                onChange={(e) =>
                  onUpdateFixed(item.id, "amount", Number(e.target.value) || 0)
                }
                className="w-32"
              />
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {t("perMonth")}
              </span>
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
          <h3 className="text-sm font-medium text-muted-foreground">
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
                className="w-32"
              />
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {t("perUserMonth")}
              </span>
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
      </CardContent>
    </Card>
  );
}
