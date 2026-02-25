"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleToggle } from "@/components/locale-toggle";

export function SiteHeader() {
  const t = useTranslations("app");

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-8 py-4">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-brand leading-none">
              {t("title")}
              <span className="ml-1.5 text-base font-medium text-brand/60">(β)</span>
            </span>
            <span className="text-xs text-muted-foreground">{t("description")}</span>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/help" aria-label="Help">
              <HelpCircle className="h-4 w-4" />
            </Link>
          </Button>
          <LocaleToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
