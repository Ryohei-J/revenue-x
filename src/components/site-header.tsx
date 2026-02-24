"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleToggle } from "@/components/locale-toggle";

export function SiteHeader() {
  const t = useTranslations("app");

  return (
    <header className="container mx-auto flex items-center justify-between p-4 pb-0">
      <Link href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
        {t("title")}
      </Link>
      <div className="flex items-center gap-2">
        <LocaleToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}
