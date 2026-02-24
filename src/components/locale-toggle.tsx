"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export function LocaleToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function toggleLocale() {
    const next = locale === "ja" ? "en" : "ja";
    router.replace(pathname, { locale: next });
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleLocale}>
      <Languages className="h-4 w-4" />
      <span className="sr-only">
        {locale === "ja" ? "Switch to English" : "日本語に切替"}
      </span>
    </Button>
  );
}
