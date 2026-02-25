"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";

const SECTIONS = [1, 2, 3, 4, 5] as const;

export default function HelpPage() {
  const t = useTranslations("help");
  const tLegal = useTranslations("legal");

  return (
    <article className="container mx-auto max-w-2xl px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {tLegal("backToHome")}
      </Link>
      <h1 className="mb-2 text-3xl font-bold">{t("title")}</h1>
      <p className="mb-8 text-sm text-muted-foreground">{t("subtitle")}</p>
      <p className="mb-6 leading-relaxed text-muted-foreground">{t("intro")}</p>
      <div className="space-y-6">
        {SECTIONS.map((n) => (
          <section key={n}>
            <h2 className="mb-2 text-lg font-semibold">{t(`section${n}Title`)}</h2>
            <p className="leading-relaxed text-muted-foreground">{t(`section${n}Content`)}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
