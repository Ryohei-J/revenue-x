"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";

type Section = {
  titleKey: string;
  contentKey: string;
};

type Props = {
  namespace: "privacy" | "terms";
  sections: Section[];
};

export function LegalPage({ namespace, sections }: Props) {
  const t = useTranslations(namespace);
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
      <p className="mb-8 text-sm text-muted-foreground">{t("lastUpdated")}</p>
      <p className="mb-6 leading-relaxed text-muted-foreground">{t("intro")}</p>
      <div className="space-y-6">
        {sections.map((section) => (
          <section key={section.titleKey}>
            <h2 className="mb-2 text-lg font-semibold">
              {t(section.titleKey)}
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              {t(section.contentKey)}
            </p>
          </section>
        ))}
      </div>
    </article>
  );
}
