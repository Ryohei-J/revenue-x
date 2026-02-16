export type ExpenseItem = {
  id: string;
  name: string;
  amount: number; // 月額（円）
};

export type IncomeItem = {
  id: string;
  name: string;
  amount: number; // 月額（円）
};

export type SimulationConfig = {
  expenses: ExpenseItem[];
  incomes: IncomeItem[];
  periodMonths: number; // 計算期間（月）
  monthlyGrowthRate: number; // 月次成長率（%）
};

export type MonthlyData = {
  month: number;
  totalExpense: number;
  totalIncome: number;
  profit: number; // 当月損益
  cumulativeProfit: number; // 累計損益
};
