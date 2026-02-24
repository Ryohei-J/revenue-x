"use client";

import { useSimulation } from "@/hooks/use-simulation";
import { ExpenseCard } from "@/components/expense-card";
import { IncomeCard } from "@/components/income-card";
import { PeriodCard } from "@/components/period-card";
import { ChartCard } from "@/components/chart-card";
import { StatsCards } from "@/components/stats-cards";
import { BreakdownCharts } from "@/components/breakdown-charts";
import { MilestoneCard } from "@/components/milestone-card";

export default function HomePage() {
  const sim = useSimulation();

  if (!sim.config) {
    return null;
  }

  return (
    <main className="container mx-auto p-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-4">
          <ExpenseCard
            initialCosts={sim.config.initialCosts}
            fixedExpenses={sim.config.fixedExpenses}
            variableExpenses={sim.config.variableExpenses}
            transactionFees={sim.config.transactionFees}
            onAddInitialCost={sim.addInitialCost}
            onUpdateInitialCost={sim.updateInitialCost}
            onRemoveInitialCost={sim.removeInitialCost}
            onAddFixed={sim.addFixedExpense}
            onUpdateFixed={sim.updateFixedExpense}
            onRemoveFixed={sim.removeFixedExpense}
            onAddVariable={sim.addVariableExpense}
            onUpdateVariable={sim.updateVariableExpense}
            onRemoveVariable={sim.removeVariableExpense}
            onAddTransactionFee={sim.addTransactionFee}
            onUpdateTransactionFee={sim.updateTransactionFee}
            onRemoveTransactionFee={sim.removeTransactionFee}
          />
          <IncomeCard
            subscriptions={sim.config.subscriptions}
            ads={sim.config.ads}
            oneTimePurchases={sim.config.oneTimePurchases}
            onAddSubscription={sim.addSubscription}
            onUpdateSubscription={sim.updateSubscription}
            onRemoveSubscription={sim.removeSubscription}
            onAddAd={sim.addAd}
            onUpdateAd={sim.updateAd}
            onRemoveAd={sim.removeAd}
            onAddOneTimePurchase={sim.addOneTimePurchase}
            onUpdateOneTimePurchase={sim.updateOneTimePurchase}
            onRemoveOneTimePurchase={sim.removeOneTimePurchase}
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
        <div className="space-y-4 lg:col-span-8">
          <StatsCards data={sim.chartData} />
          <ChartCard data={sim.chartData} />
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2">
              <BreakdownCharts config={sim.config} />
            </div>
            <div className="col-span-2">
              <MilestoneCard />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
