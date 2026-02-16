"use client";

import { useTranslations } from "next-intl";
import { useSimulation } from "@/hooks/use-simulation";
import { ExpenseCard } from "@/components/expense-card";
import { IncomeCard } from "@/components/income-card";
import { PeriodCard } from "@/components/period-card";
import { ChartCard } from "@/components/chart-card";
import { ThemeToggle } from "@/components/theme-toggle";

export default function HomePage() {
  const t = useTranslations("app");
  const sim = useSimulation();

  if (!sim.config) {
    return null;
  }

  return (
    <main className="container mx-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <ThemeToggle />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-4">
          <ExpenseCard
            expenses={sim.config.expenses}
            onAdd={sim.addExpense}
            onUpdate={sim.updateExpense}
            onRemove={sim.removeExpense}
          />
          <IncomeCard
            incomes={sim.config.incomes}
            onAdd={sim.addIncome}
            onUpdate={sim.updateIncome}
            onRemove={sim.removeIncome}
          />
          <PeriodCard
            periodMonths={sim.config.periodMonths}
            monthlyGrowthRate={sim.config.monthlyGrowthRate}
            onPeriodChange={sim.setPeriodMonths}
            onGrowthRateChange={sim.setMonthlyGrowthRate}
          />
        </div>
        <div className="lg:col-span-8">
          <ChartCard data={sim.chartData} />
        </div>
      </div>
    </main>
  );
}
