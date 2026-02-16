"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import type {
  SimulationConfig,
  ExpenseItem,
  IncomeItem,
  MonthlyData,
} from "@/types";
import { calculateSimulation } from "@/lib/calc";
import { loadConfig, createDebouncedSave } from "@/lib/storage";

export function useSimulation() {
  const [config, setConfig] = useState<SimulationConfig | null>(null);
  const debouncedSaveRef = useRef(createDebouncedSave(500));
  const isInitialRef = useRef(true);

  // LocalStorageからの初期読み込み（外部ストアとの同期）
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage同期
    setConfig(loadConfig());
  }, []);

  // config変更時にdebounced save（初回ロードはスキップ）
  useEffect(() => {
    if (isInitialRef.current) {
      isInitialRef.current = false;
      return;
    }
    if (config) {
      debouncedSaveRef.current(config);
    }
  }, [config]);

  const chartData: MonthlyData[] = useMemo(() => {
    if (!config) return [];
    return calculateSimulation(config);
  }, [config]);

  // --- 支出操作 ---
  const addExpense = useCallback(() => {
    setConfig((prev) => {
      if (!prev) return prev;
      const newItem: ExpenseItem = {
        id: crypto.randomUUID(),
        name: "",
        amount: 0,
      };
      return { ...prev, expenses: [...prev.expenses, newItem] };
    });
  }, []);

  const updateExpense = useCallback(
    (id: string, field: "name" | "amount", value: string | number) => {
      setConfig((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          expenses: prev.expenses.map((e) =>
            e.id === id ? { ...e, [field]: value } : e
          ),
        };
      });
    },
    []
  );

  const removeExpense = useCallback((id: string) => {
    setConfig((prev) => {
      if (!prev) return prev;
      return { ...prev, expenses: prev.expenses.filter((e) => e.id !== id) };
    });
  }, []);

  // --- 収入操作 ---
  const addIncome = useCallback(() => {
    setConfig((prev) => {
      if (!prev) return prev;
      const newItem: IncomeItem = {
        id: crypto.randomUUID(),
        name: "",
        amount: 0,
      };
      return { ...prev, incomes: [...prev.incomes, newItem] };
    });
  }, []);

  const updateIncome = useCallback(
    (id: string, field: "name" | "amount", value: string | number) => {
      setConfig((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          incomes: prev.incomes.map((i) =>
            i.id === id ? { ...i, [field]: value } : i
          ),
        };
      });
    },
    []
  );

  const removeIncome = useCallback((id: string) => {
    setConfig((prev) => {
      if (!prev) return prev;
      return { ...prev, incomes: prev.incomes.filter((i) => i.id !== id) };
    });
  }, []);

  // --- 期間設定 ---
  const setPeriodMonths = useCallback((months: number) => {
    setConfig((prev) => (prev ? { ...prev, periodMonths: months } : prev));
  }, []);

  const setMonthlyGrowthRate = useCallback((rate: number) => {
    setConfig((prev) =>
      prev ? { ...prev, monthlyGrowthRate: rate } : prev
    );
  }, []);

  return {
    config,
    chartData,
    addExpense,
    updateExpense,
    removeExpense,
    addIncome,
    updateIncome,
    removeIncome,
    setPeriodMonths,
    setMonthlyGrowthRate,
  };
}
