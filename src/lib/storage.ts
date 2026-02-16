import type { SimulationConfig } from "@/types";

const STORAGE_KEY = "revenue-x-simulation";

const DEFAULT_CONFIG: SimulationConfig = {
  expenses: [{ id: crypto.randomUUID(), name: "", amount: 0 }],
  incomes: [{ id: crypto.randomUUID(), name: "", amount: 0 }],
  periodMonths: 12,
  monthlyGrowthRate: 5,
};

export function loadConfig(): SimulationConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    return JSON.parse(raw) as SimulationConfig;
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
