import { describe, it, expect } from "vitest";
import { calculateSimulation } from "@/lib/calc";
import type { SimulationConfig } from "@/types";

describe("calculateSimulation", () => {
  it("returns empty array for 0-month period", () => {
    const config: SimulationConfig = {
      expenses: [],
      incomes: [],
      periodMonths: 0,
      monthlyGrowthRate: 0,
    };
    expect(calculateSimulation(config)).toEqual([]);
  });

  it("calculates flat income with 0% growth", () => {
    const config: SimulationConfig = {
      expenses: [{ id: "1", name: "Server", amount: 2000 }],
      incomes: [{ id: "1", name: "Ads", amount: 5000 }],
      periodMonths: 3,
      monthlyGrowthRate: 0,
    };
    const result = calculateSimulation(config);
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      month: 1,
      totalExpense: 2000,
      totalIncome: 5000,
      profit: 3000,
      cumulativeProfit: 3000,
    });
    expect(result[2].totalIncome).toBe(5000);
    expect(result[2].cumulativeProfit).toBe(9000);
  });

  it("applies compound growth to income", () => {
    const config: SimulationConfig = {
      expenses: [{ id: "1", name: "Server", amount: 1000 }],
      incomes: [{ id: "1", name: "Ads", amount: 10000 }],
      periodMonths: 2,
      monthlyGrowthRate: 10,
    };
    const result = calculateSimulation(config);
    expect(result[0].totalIncome).toBe(10000);
    expect(result[1].totalIncome).toBe(11000);
  });

  it("handles negative profit (loss)", () => {
    const config: SimulationConfig = {
      expenses: [{ id: "1", name: "Server", amount: 10000 }],
      incomes: [{ id: "1", name: "Ads", amount: 1000 }],
      periodMonths: 2,
      monthlyGrowthRate: 0,
    };
    const result = calculateSimulation(config);
    expect(result[0].profit).toBe(-9000);
    expect(result[1].cumulativeProfit).toBe(-18000);
  });

  it("handles multiple expense and income items", () => {
    const config: SimulationConfig = {
      expenses: [
        { id: "1", name: "Server", amount: 2000 },
        { id: "2", name: "API", amount: 3000 },
      ],
      incomes: [
        { id: "1", name: "Ads", amount: 4000 },
        { id: "2", name: "Subscriptions", amount: 6000 },
      ],
      periodMonths: 1,
      monthlyGrowthRate: 0,
    };
    const result = calculateSimulation(config);
    expect(result[0].totalExpense).toBe(5000);
    expect(result[0].totalIncome).toBe(10000);
    expect(result[0].profit).toBe(5000);
  });
});
