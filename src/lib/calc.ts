import type { SimulationConfig, MonthlyData } from "@/types";

// 月次シミュレーションデータを計算する
// ユーザー数: initialUsers × (1 + growthRate/100)^(n-1)
// 契約者数: プランごとに独立して計算（各プランの課金率・解約率を使用）
// サブスク収入: Σ(プランごとの契約者数 × 単価)
// 広告収入: ユーザー数 × 広告単価合計
// 固定費: 毎月一定
// 変動費: ユーザーあたりコスト合計 × ユーザー数
export function calculateSimulation(config: SimulationConfig): MonthlyData[] {
  const {
    initialCosts,
    fixedExpenses,
    variableExpenses,
    transactionFees,
    subscriptions,
    ads,
    periodMonths,
    monthlyGrowthRate,
    initialUsers,
  } = config;

  const initialCostTotal = initialCosts.reduce(
    (sum, e) => sum + e.amount,
    0
  );
  const fixedExpensePerMonth = fixedExpenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );
  const variableCostPerUser = variableExpenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );
  const totalFeeRate = transactionFees.reduce(
    (sum, f) => sum + f.rate,
    0
  );
  const adRevenuePerUser = ads.reduce((sum, a) => sum + a.amount, 0);
  const growthMultiplier = 1 + monthlyGrowthRate / 100;

  // プランごとの前月契約者数を追跡
  const prevSubscribersByPlan = new Map<string, number>();
  for (const sub of subscriptions) {
    prevSubscribersByPlan.set(sub.id, 0);
  }

  const result: MonthlyData[] = [];
  let cumulativeProfit = 0;
  let prevUsers = 0;

  for (let month = 1; month <= periodMonths; month++) {
    const growthFactor = Math.pow(growthMultiplier, month - 1);
    const users = Math.max(0, initialUsers * growthFactor);
    const newUsers = Math.max(0, users - prevUsers);

    // プランごとに契約者数と収入を計算
    let totalSubscribers = 0;
    let subscriptionIncome = 0;

    for (const sub of subscriptions) {
      const prevSubs = prevSubscribersByPlan.get(sub.id) ?? 0;
      const conversionFactor = sub.conversionRate / 100;
      const churnFactor = sub.churnRate / 100;

      const newSubs = newUsers * conversionFactor;
      const churned = prevSubs * churnFactor;
      const currentSubs = Math.max(0, prevSubs - churned + newSubs);

      prevSubscribersByPlan.set(sub.id, currentSubs);
      totalSubscribers += currentSubs;
      subscriptionIncome += sub.amount * currentSubs;
    }

    const adIncome = adRevenuePerUser * users;
    const feeExpense = subscriptionIncome * (totalFeeRate / 100);
    const totalIncome = subscriptionIncome + adIncome;
    const totalExpense =
      (month === 1 ? initialCostTotal : 0) +
      fixedExpensePerMonth +
      variableCostPerUser * users +
      feeExpense;
    const profit = totalIncome - totalExpense;
    cumulativeProfit += profit;

    result.push({
      month,
      users: Math.round(users),
      subscribers: Math.round(totalSubscribers),
      totalExpense: Math.round(totalExpense),
      totalIncome: Math.round(totalIncome),
      profit: Math.round(profit),
      cumulativeProfit: Math.round(cumulativeProfit),
    });

    prevUsers = users;
  }

  return result;
}

// 累計損益の最小値（最大赤字額）を返す。
// データが空なら null。
export function getMaxCumulativeDeficit(data: MonthlyData[]): number | null {
  if (data.length === 0) return null;
  return Math.min(...data.map((d) => d.cumulativeProfit));
}

// 損益分岐点（BEP）の月を探す。
// cumulativeProfit が負→正に初めて転じる月を線形補間で返す。
// BEPが存在しない場合は null を返す。
export function findBreakEvenMonth(data: MonthlyData[]): number | null {
  for (let i = 1; i < data.length; i++) {
    const prev = data[i - 1];
    const curr = data[i];
    if (prev.cumulativeProfit <= 0 && curr.cumulativeProfit > 0) {
      return (
        prev.month +
        (-prev.cumulativeProfit) /
          (curr.cumulativeProfit - prev.cumulativeProfit)
      );
    }
  }
  return null;
}
