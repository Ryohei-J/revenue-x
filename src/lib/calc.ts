import type { SimulationConfig, MonthlyData } from "@/types";

// 月次シミュレーションデータを計算する
// 成長モデル: 収入_n = 初月収入合計 × (1 + monthlyGrowthRate/100)^(n-1)
// 支出は固定
export function calculateSimulation(config: SimulationConfig): MonthlyData[] {
  const { expenses, incomes, periodMonths, monthlyGrowthRate } = config;

  const totalExpensePerMonth = expenses.reduce((sum, e) => sum + e.amount, 0);
  const baseIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const growthMultiplier = 1 + monthlyGrowthRate / 100;

  const result: MonthlyData[] = [];
  let cumulativeProfit = 0;

  for (let month = 1; month <= periodMonths; month++) {
    const totalIncome = baseIncome * Math.pow(growthMultiplier, month - 1);
    const totalExpense = totalExpensePerMonth;
    const profit = totalIncome - totalExpense;
    cumulativeProfit += profit;

    result.push({
      month,
      totalExpense: Math.round(totalExpense),
      totalIncome: Math.round(totalIncome),
      profit: Math.round(profit),
      cumulativeProfit: Math.round(cumulativeProfit),
    });
  }

  return result;
}
