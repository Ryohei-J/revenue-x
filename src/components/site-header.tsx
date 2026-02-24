"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleToggle } from "@/components/locale-toggle";

export function SiteHeader() {
  const t = useTranslations("app");

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-3xl font-bold text-brand hover:opacity-80 transition-opacity">
          {t("title")}
        </Link>
        <div className="flex items-center gap-2">
          <LocaleToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
