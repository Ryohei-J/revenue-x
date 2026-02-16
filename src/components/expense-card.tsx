"use client";

import { useTranslations } from "next-intl";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ExpenseItem } from "@/types";

type Props = {
  expenses: ExpenseItem[];
  onAdd: () => void;
  onUpdate: (id: string, field: "name" | "amount", value: string | number) => void;
  onRemove: (id: string) => void;
};

export function ExpenseCard({ expenses, onAdd, onUpdate, onRemove }: Props) {
  const t = useTranslations("expense");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {expenses.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <Input
              placeholder={t("namePlaceholder")}
              value={item.name}
              onChange={(e) => onUpdate(item.id, "name", e.target.value)}
              className="flex-1"
            />
            <Input
              type="number"
              placeholder={t("amountPlaceholder")}
              value={item.amount || ""}
              onChange={(e) =>
                onUpdate(item.id, "amount", Number(e.target.value) || 0)
              }
              className="w-32"
            />
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {t("perMonth")}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={onAdd} className="w-full">
          <Plus className="mr-1 h-4 w-4" />
          {t("addButton")}
        </Button>
      </CardContent>
    </Card>
  );
}
