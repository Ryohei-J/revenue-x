import type { SimulationConfig } from "@/types";

const STORAGE_KEY = "revenue-x-simulation";

const DEFAULT_CONFIG: SimulationConfig = {
  initialCosts: [],
  fixedExpenses: [{ id: crypto.randomUUID(), name: "", amount: 0, currency: "JPY", billingCycle: "monthly" as const }],
  variableExpenses: [{ id: crypto.randomUUID(), name: "", amount: 0, currency: "JPY", billingCycle: "monthly" as const }],
  transactionFees: [],
  subscriptions: [
    {
      id: crypto.randomUUID(),
      name: "",
      amount: 0,
      currency: "JPY",
      billingCycle: "monthly" as const,
      conversionRate: 5,
      churnRate: 3,
    },
  ],
  ads: [{ id: crypto.randomUUID(), name: "", amount: 0, currency: "JPY", billingCycle: "monthly" as const }],
  oneTimePurchases: [],
  periodMonths: 12,
  monthlyGrowthRate: 5,
  initialUsers: 100,
  exchangeRate: 150,
};

export function loadConfig(): SimulationConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw);

    // 旧形式からのマイグレーション
    if (parsed.expenses && !parsed.fixedExpenses) {
      parsed.fixedExpenses = parsed.expenses;
      parsed.variableExpenses = [
        { id: crypto.randomUUID(), name: "", amount: 0 },
      ];
      delete parsed.expenses;
    }
    if (parsed.initialUsers === undefined) {
      parsed.initialUsers = 100;
    }
    // incomes → subscriptions + ads マイグレーション
    if (parsed.incomes && !parsed.subscriptions) {
      parsed.subscriptions = parsed.incomes.map(
        (item: { id: string; name: string; amount: number }) => ({
          ...item,
          conversionRate: 5,
          churnRate: 3,
        })
      );
      parsed.ads = [{ id: crypto.randomUUID(), name: "", amount: 0 }];
      delete parsed.incomes;
    }
    // conversionRate/churnRate がグローバルにある旧形式からのマイグレーション
    if (parsed.conversionRate !== undefined && parsed.subscriptions) {
      for (const sub of parsed.subscriptions) {
        if (sub.conversionRate === undefined) {
          sub.conversionRate = parsed.conversionRate;
        }
        if (sub.churnRate === undefined) {
          sub.churnRate = parsed.churnRate ?? 3;
        }
      }
      delete parsed.conversionRate;
      delete parsed.churnRate;
    }

    // initialCosts / transactionFees マイグレーション
    if (!parsed.initialCosts) {
      parsed.initialCosts = [];
    }
    if (!parsed.transactionFees) {
      parsed.transactionFees = [];
    }
    if (!parsed.oneTimePurchases) {
      parsed.oneTimePurchases = [];
    }

    // exchangeRate マイグレーション
    if (parsed.exchangeRate === undefined) {
      parsed.exchangeRate = 150;
    }

    // currency フィールドのマイグレーション
    for (const arr of [
      "initialCosts",
      "fixedExpenses",
      "variableExpenses",
      "subscriptions",
      "ads",
      "oneTimePurchases",
    ]) {
      if (parsed[arr]) {
        for (const item of parsed[arr]) {
          if (item.currency === undefined) {
            item.currency = "JPY";
          }
        }
      }
    }

    // billingCycle フィールドのマイグレーション（定期的な項目のみ）
    for (const arr of [
      "fixedExpenses",
      "variableExpenses",
      "subscriptions",
      "ads",
    ]) {
      if (parsed[arr]) {
        for (const item of parsed[arr]) {
          if (item.billingCycle === undefined) {
            item.billingCycle = "monthly";
          }
        }
      }
    }

    return parsed as SimulationConfig;
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveConfig(config: SimulationConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // localStorage full or unavailable
  }
}

export function createDebouncedSave(delayMs: number = 500) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (config: SimulationConfig) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => saveConfig(config), delayMs);
  };
}
