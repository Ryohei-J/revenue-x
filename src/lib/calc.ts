import type { SimulationConfig, MonthlyData, BreakdownData, Currency, BillingCycle } from "@/types";

function toJPY(amount: number, currency: Currency, exchangeRate: number): number {
  return currency === "USD" ? amount * exchangeRate : amount;
}

function toMonthly(amount: number, billingCycle: BillingCycle): number {
  return billingCycle === "yearly" ? amount / 12 : amount;
}

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
    oneTimePurchases,
    periodMonths,
    monthlyGrowthRate,
    initialUsers,
    exchangeRate,
  } = config;

  const initialCostTotal = initialCosts.reduce(
    (sum, e) => sum + toJPY(e.amount, e.currency, exchangeRate),
    0
  );
  const fixedExpensePerMonth = fixedExpenses.reduce(
    (sum, e) => sum + toMonthly(toJPY(e.amount, e.currency, exchangeRate), e.billingCycle),
    0
  );
  const variableCostPerUser = variableExpenses.reduce(
    (sum, e) => sum + toMonthly(toJPY(e.amount, e.currency, exchangeRate), e.billingCycle),
    0
  );
  const totalFeeRate = transactionFees.reduce(
    (sum, f) => sum + f.rate,
    0
  );
  const adRevenuePerUser = ads.reduce(
    (sum, a) => sum + toMonthly(toJPY(a.amount, a.currency, exchangeRate), a.billingCycle),
    0
  );
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
      subscriptionIncome += toMonthly(toJPY(sub.amount, sub.currency, exchangeRate), sub.billingCycle) * currentSubs;
    }

    // 買い切り収入: 当月新規ユーザーのうち購入率分が購入
    let oneTimePurchaseIncome = 0;
    for (const otp of oneTimePurchases) {
      oneTimePurchaseIncome += newUsers * (otp.conversionRate / 100) * toJPY(otp.amount, otp.currency, exchangeRate);
    }

    const adIncome = adRevenuePerUser * users;
    const feeExpense = (subscriptionIncome + oneTimePurchaseIncome) * (totalFeeRate / 100);
    const totalIncome = subscriptionIncome + oneTimePurchaseIncome + adIncome;
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

// 期間全体の収支カテゴリ別合計を計算する。
// 円グラフ用のデータ。
export function calculateBreakdown(config: SimulationConfig): BreakdownData {
  const {
    initialCosts,
    fixedExpenses,
    variableExpenses,
    transactionFees,
    subscriptions,
    ads,
    oneTimePurchases,
    periodMonths,
    monthlyGrowthRate,
    initialUsers,
    exchangeRate,
  } = config;

  const initialCostTotal = initialCosts.reduce((sum, e) => sum + toJPY(e.amount, e.currency, exchangeRate), 0);
  const fixedExpensePerMonth = fixedExpenses.reduce(
    (sum, e) => sum + toMonthly(toJPY(e.amount, e.currency, exchangeRate), e.billingCycle),
    0
  );
  const variableCostPerUser = variableExpenses.reduce(
    (sum, e) => sum + toMonthly(toJPY(e.amount, e.currency, exchangeRate), e.billingCycle),
    0
  );
  const totalFeeRate = transactionFees.reduce((sum, f) => sum + f.rate, 0);
  const adRevenuePerUser = ads.reduce(
    (sum, a) => sum + toMonthly(toJPY(a.amount, a.currency, exchangeRate), a.billingCycle),
    0
  );
  const growthMultiplier = 1 + monthlyGrowthRate / 100;

  const prevSubscribersByPlan = new Map<string, number>();
  for (const sub of subscriptions) {
    prevSubscribersByPlan.set(sub.id, 0);
  }

  let totalInitialCost = 0;
  let totalFixedExpense = 0;
  let totalVariableExpense = 0;
  let totalTransactionFee = 0;
  let totalSubscription = 0;
  let totalOneTimePurchase = 0;
  let totalAd = 0;
  let prevUsers = 0;

  for (let month = 1; month <= periodMonths; month++) {
    const growthFactor = Math.pow(growthMultiplier, month - 1);
    const users = Math.max(0, initialUsers * growthFactor);
    const newUsers = Math.max(0, users - prevUsers);

    let subscriptionIncome = 0;
    for (const sub of subscriptions) {
      const prevSubs = prevSubscribersByPlan.get(sub.id) ?? 0;
      const newSubs = newUsers * (sub.conversionRate / 100);
      const churned = prevSubs * (sub.churnRate / 100);
      const currentSubs = Math.max(0, prevSubs - churned + newSubs);
      prevSubscribersByPlan.set(sub.id, currentSubs);
      subscriptionIncome += toMonthly(toJPY(sub.amount, sub.currency, exchangeRate), sub.billingCycle) * currentSubs;
    }

    let oneTimePurchaseIncome = 0;
    for (const otp of oneTimePurchases) {
      oneTimePurchaseIncome += newUsers * (otp.conversionRate / 100) * toJPY(otp.amount, otp.currency, exchangeRate);
    }

    const adIncome = adRevenuePerUser * users;
    const feeExpense = (subscriptionIncome + oneTimePurchaseIncome) * (totalFeeRate / 100);

    if (month === 1) totalInitialCost += initialCostTotal;
    totalFixedExpense += fixedExpensePerMonth;
    totalVariableExpense += variableCostPerUser * users;
    totalTransactionFee += feeExpense;
    totalSubscription += subscriptionIncome;
    totalOneTimePurchase += oneTimePurchaseIncome;
    totalAd += adIncome;

    prevUsers = users;
  }

  return {
    expense: {
      initialCost: Math.round(totalInitialCost),
      fixedExpense: Math.round(totalFixedExpense),
      variableExpense: Math.round(totalVariableExpense),
      transactionFee: Math.round(totalTransactionFee),
    },
    income: {
      subscription: Math.round(totalSubscription),
      oneTimePurchase: Math.round(totalOneTimePurchase),
      ad: Math.round(totalAd),
    },
  };
}

// プランごとの期間末契約者数を返す。
export function getFinalSubscribersByPlan(config: SimulationConfig): { name: string; count: number }[] {
  const { subscriptions, periodMonths, monthlyGrowthRate, initialUsers } = config;
  if (subscriptions.length === 0) return [];

  const prevSubscribersByPlan = new Map<string, number>();
  for (const sub of subscriptions) {
    prevSubscribersByPlan.set(sub.id, 0);
  }

  const growthMultiplier = 1 + monthlyGrowthRate / 100;
  let prevUsers = 0;

  for (let month = 1; month <= periodMonths; month++) {
    const users = Math.max(0, initialUsers * Math.pow(growthMultiplier, month - 1));
    const newUsers = Math.max(0, users - prevUsers);
    for (const sub of subscriptions) {
      const prevSubs = prevSubscribersByPlan.get(sub.id) ?? 0;
      const currentSubs = Math.max(
        0,
        prevSubs - prevSubs * (sub.churnRate / 100) + newUsers * (sub.conversionRate / 100)
      );
      prevSubscribersByPlan.set(sub.id, currentSubs);
    }
    prevUsers = users;
  }

  return subscriptions.map((sub) => ({
    name: sub.name || "（名称未設定）",
    count: Math.round(prevSubscribersByPlan.get(sub.id) ?? 0),
  }));
}

// 指定した月収閾値に最初に達する月を返す。期間内に達しない場合は null。
export function findIncomeMonth(data: MonthlyData[], threshold: number): number | null {
  for (const d of data) {
    if (d.totalIncome >= threshold) return d.month;
  }
  return null;
}

// 損益分岐点（BEP）の月を探す。
// cumulativeProfit が負→正に初めて転じる月を線形補間で返す。
// BEPが存在しない場合は null を返す。
export function findBreakEvenMonth(data: MonthlyData[]): number | null {
  if (data.length === 0) return null;

  // 1ヶ月目から黒字の場合
  if (data[0].cumulativeProfit > 0) return 1;

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
