"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { BillingCycle } from "@/types";

type Props = {
  billingCycle: BillingCycle;
  onChange: (billingCycle: BillingCycle) => void;
};

export function BillingCycleToggle({ billingCycle, onChange }: Props) {
  const t = useTranslations("common");

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "h-8 px-2 text-xs font-semibold shrink-0"
      )}
      onClick={() => onChange(billingCycle === "monthly" ? "yearly" : "monthly")}
    >
      {billingCycle === "monthly" ? t("monthly") : t("yearly")}
    </Button>
  );
}
