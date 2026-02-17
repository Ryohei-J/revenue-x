import { describe, it, expect } from "vitest";
import { calculateSimulation } from "@/lib/calc";
import type { SimulationConfig } from "@/types";

// ヘルパー: デフォルト値をマージ
function makeConfig(
  overrides: Partial<SimulationConfig> = {}
): SimulationConfig {
  return {
    fixedExpenses: [],
    variableExpenses: [],
    subscriptions: [],
    ads: [],
    periodMonths: 0,
    monthlyGrowthRate: 0,
    initialUsers: 0,
    ...overrides,
  };
}

describe("calculateSimulation", () => {
  it("returns empty array for 0-month period", () => {
    const config = makeConfig();
    expect(calculateSimulation(config)).toEqual([]);
  });

  it("calculates flat ad income with 0% growth", () => {
    const config = makeConfig({
      fixedExpenses: [{ id: "1", name: "Server", amount: 2000 }],
      ads: [{ id: "1", name: "Banner", amount: 50 }],
      periodMonths: 3,
      initialUsers: 100,
    });
    const result = calculateSimulation(config);
    expect(result).toHaveLength(3);
    // 広告収入 = 50 × 100ユーザー = 5000
    expect(result[0]).toEqual({
      month: 1,
      users: 100,
      subscribers: 0,
      totalExpense: 2000,
      totalIncome: 5000,
      profit: 3000,
      cumulativeProfit: 3000,
    });
    expect(result[2].totalIncome).toBe(5000);
    expect(result[2].cumulativeProfit).toBe(9000);
  });

  it("applies compound growth to user count and ad income", () => {
    const config = makeConfig({
      fixedExpenses: [{ id: "1", name: "Server", amount: 1000 }],
      ads: [{ id: "1", name: "Banner", amount: 100 }],
      periodMonths: 2,
      monthlyGrowthRate: 10,
      initialUsers: 100,
    });
    const result = calculateSimulation(config);
    expect(result[0].totalIncome).toBe(10000);
    expect(result[1].totalIncome).toBe(11000);
  });

  it("handles negative profit (loss)", () => {
    const config = makeConfig({
      fixedExpenses: [{ id: "1", name: "Server", amount: 10000 }],
      ads: [{ id: "1", name: "Banner", amount: 10 }],
      periodMonths: 2,
      initialUsers: 100,
    });
    const result = calculateSimulation(config);
    expect(result[0].profit).toBe(-9000);
    expect(result[1].cumulativeProfit).toBe(-18000);
  });

  it("handles multiple expense and income items", () => {
    const config = makeConfig({
      fixedExpenses: [
        { id: "1", name: "Server", amount: 2000 },
        { id: "2", name: "API", amount: 3000 },
      ],
      ads: [
        { id: "1", name: "Banner", amount: 40 },
        { id: "2", name: "Native", amount: 60 },
      ],
      periodMonths: 1,
      initialUsers: 100,
    });
    const result = calculateSimulation(config);
    expect(result[0].totalExpense).toBe(5000);
    expect(result[0].totalIncome).toBe(10000);
    expect(result[0].profit).toBe(5000);
  });

  it("calculates variable expenses based on user count", () => {
    const config = makeConfig({
      fixedExpenses: [{ id: "1", name: "Server", amount: 1000 }],
      variableExpenses: [{ id: "1", name: "API calls", amount: 10 }],
      ads: [{ id: "1", name: "Banner", amount: 50 }],
      periodMonths: 1,
      initialUsers: 100,
    });
    const result = calculateSimulation(config);
    expect(result[0].totalExpense).toBe(2000);
    expect(result[0].users).toBe(100);
  });

  it("grows user count with monthly growth rate", () => {
    const config = makeConfig({
      variableExpenses: [{ id: "1", name: "API", amount: 5 }],
      periodMonths: 3,
      monthlyGrowthRate: 10,
      initialUsers: 100,
    });
    const result = calculateSimulation(config);
    expect(result[0].users).toBe(100);
    expect(result[1].users).toBe(110);
    expect(result[2].users).toBe(121);
    expect(result[0].totalExpense).toBe(500);
    expect(result[1].totalExpense).toBe(550);
    expect(result[2].totalExpense).toBe(605);
  });

  it("handles 0 initial users", () => {
    const config = makeConfig({
      variableExpenses: [{ id: "1", name: "API", amount: 10 }],
      periodMonths: 2,
      monthlyGrowthRate: 10,
      initialUsers: 0,
    });
    const result = calculateSimulation(config);
    expect(result[0].users).toBe(0);
    expect(result[1].users).toBe(0);
    expect(result[0].totalExpense).toBe(0);
  });

  it("calculates per-plan subscription income with conversion and churn", () => {
    const config = makeConfig({
      subscriptions: [
        { id: "1", name: "Pro", amount: 1000, conversionRate: 10, churnRate: 0 },
      ],
      periodMonths: 3,
      initialUsers: 100,
      monthlyGrowthRate: 0,
    });
    const result = calculateSimulation(config);
    // 月1: 新規100ユーザー × 10% = 10契約者, 収入 = 10 × 1000 = 10000
    expect(result[0].subscribers).toBe(10);
    expect(result[0].totalIncome).toBe(10000);
    // 月2: 成長率0%なので新規ユーザー0, 契約者は前月の10のまま
    expect(result[1].subscribers).toBe(10);
    expect(result[1].totalIncome).toBe(10000);
  });

  it("applies per-plan churn to subscribers", () => {
    const config = makeConfig({
      subscriptions: [
        {
          id: "1",
          name: "Pro",
          amount: 1000,
          conversionRate: 10,
          churnRate: 50,
        },
      ],
      periodMonths: 2,
      initialUsers: 1000,
      monthlyGrowthRate: 0,
    });
    const result = calculateSimulation(config);
    // 月1: 新規1000ユーザー × 10% = 100契約者
    expect(result[0].subscribers).toBe(100);
    // 月2: 解約 = 100 × 50% = 50, 新規ユーザー0 → 契約者 = 50
    expect(result[1].subscribers).toBe(50);
  });

  it("tracks subscribers independently per plan", () => {
    const config = makeConfig({
      subscriptions: [
        {
          id: "1",
          name: "Basic",
          amount: 500,
          conversionRate: 20,
          churnRate: 0,
        },
        {
          id: "2",
          name: "Pro",
          amount: 2000,
          conversionRate: 5,
          churnRate: 0,
        },
      ],
      periodMonths: 1,
      initialUsers: 100,
    });
    const result = calculateSimulation(config);
    // Basic: 100 × 20% = 20契約者, Pro: 100 × 5% = 5契約者
    expect(result[0].subscribers).toBe(25);
    // 収入 = 20×500 + 5×2000 = 10000 + 10000 = 20000
    expect(result[0].totalIncome).toBe(20000);
  });

  it("combines subscription and ad income", () => {
    const config = makeConfig({
      subscriptions: [
        { id: "1", name: "Pro", amount: 500, conversionRate: 5, churnRate: 0 },
      ],
      ads: [{ id: "1", name: "Banner", amount: 10 }],
      periodMonths: 1,
      initialUsers: 200,
    });
    const result = calculateSimulation(config);
    // 契約者 = 200 × 5% = 10, サブスク収入 = 10 × 500 = 5000
    // 広告収入 = 200 × 10 = 2000
    expect(result[0].subscribers).toBe(10);
    expect(result[0].totalIncome).toBe(7000);
  });
});
