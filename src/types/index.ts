export type InitialCostItem = {
  id: string;
  name: string;
  amount: number; // 初期費用（円）、1ヶ月目のみ計上
};

export type FixedExpenseItem = {
  id: string;
  name: string;
  amount: number; // 月額（円）
};

export type VariableExpenseItem = {
  id: string;
  name: string;
  amount: number; // 1ユーザーあたり月額（円）
};

export type SubscriptionItem = {
  id: string;
  name: string;
  amount: number; // 1契約者あたり月額（円）
  conversionRate: number; // 課金率（%）
  churnRate: number; // 解約率（%）
};

export type AdItem = {
  id: string;
  name: string;
  amount: number; // 1ユーザーあたり月額（円）
};

export type TransactionFeeItem = {
  id: string;
  name: string;
  rate: number; // 決済手数料（%）、サブスク売上に対して
};

export type SimulationConfig = {
  initialCosts: InitialCostItem[];
  fixedExpenses: FixedExpenseItem[];
  variableExpenses: VariableExpenseItem[];
  transactionFees: TransactionFeeItem[];
  subscriptions: SubscriptionItem[];
  ads: AdItem[];
  periodMonths: number; // 計算期間（月）
  monthlyGrowthRate: number; // 月次成長率（%）
  initialUsers: number; // 初期ユーザー数
};

export type MonthlyData = {
  month: number;
  users: number;
  subscribers: number;
  totalExpense: number;
  totalIncome: number;
  profit: number; // 当月損益
  cumulativeProfit: number; // 累計損益
};

export type BreakdownData = {
  expense: {
    initialCost: number;      // 初期費用（期間合計）
    fixedExpense: number;     // 固定費（期間合計）
    variableExpense: number;  // 変動費（期間合計）
    transactionFee: number;   // 決済手数料（期間合計）
  };
  income: {
    subscription: number;     // サブスク収入（期間合計）
    ad: number;               // 広告収入（期間合計）
  };
};
