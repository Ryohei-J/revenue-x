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
            fixedExpenses={sim.config.fixedExpenses}
            variableExpenses={sim.config.variableExpenses}
            onAddFixed={sim.addFixedExpense}
            onUpdateFixed={sim.updateFixedExpense}
            onRemoveFixed={sim.removeFixedExpense}
            onAddVariable={sim.addVariableExpense}
            onUpdateVariable={sim.updateVariableExpense}
            onRemoveVariable={sim.removeVariableExpense}
          />
          <IncomeCard
            subscriptions={sim.config.subscriptions}
            ads={sim.config.ads}
            onAddSubscription={sim.addSubscription}
            onUpdateSubscription={sim.updateSubscription}
            onRemoveSubscription={sim.removeSubscription}
            onAddAd={sim.addAd}
            onUpdateAd={sim.updateAd}
            onRemoveAd={sim.removeAd}
          />
          <PeriodCard
            periodMonths={sim.config.periodMonths}
            monthlyGrowthRate={sim.config.monthlyGrowthRate}
            initialUsers={sim.config.initialUsers}
            onPeriodChange={sim.setPeriodMonths}
            onGrowthRateChange={sim.setMonthlyGrowthRate}
            onInitialUsersChange={sim.setInitialUsers}
          />
        </div>
        <div className="lg:col-span-8">
          <ChartCard data={sim.chartData} />
        </div>
      </div>
    </main>
  );
}
