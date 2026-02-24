"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ExternalLink } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t mt-8">
      <div className="container mx-auto flex flex-col items-center gap-4 px-4 py-6 sm:flex-row sm:justify-between">
        <p className="text-sm text-muted-foreground">{t("copyright")}</p>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link
            href="/privacy"
            className="hover:text-foreground transition-colors"
          >
            {t("privacy")}
          </Link>
          <Link
            href="/terms"
            className="hover:text-foreground transition-colors"
          >
            {t("terms")}
          </Link>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
          >
            {t("contact")}
            <ExternalLink className="h-3 w-3" />
          </a>
        </nav>
      </div>
    </footer>
  );
}
