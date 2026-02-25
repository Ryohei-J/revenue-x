"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Currency } from "@/types";

type Props = {
  currency: Currency;
  onChange: (currency: Currency) => void;
};

export function CurrencyToggle({ currency, onChange }: Props) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "h-8 w-10 px-0 text-xs font-semibold shrink-0"
      )}
      onClick={() => onChange(currency === "JPY" ? "USD" : "JPY")}
    >
      {currency === "JPY" ? "¥" : "$"}
    </Button>
  );
}
