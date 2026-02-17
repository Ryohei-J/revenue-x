"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import type {
  SimulationConfig,
  FixedExpenseItem,
  VariableExpenseItem,
  SubscriptionItem,
  AdItem,
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

  // --- 固定費操作 ---
  const addFixedExpense = useCallback(() => {
    setConfig((prev) => {
      if (!prev) return prev;
      const newItem: FixedExpenseItem = {
        id: crypto.randomUUID(),
        name: "",
        amount: 0,
      };
      return { ...prev, fixedExpenses: [...prev.fixedExpenses, newItem] };
    });
  }, []);

  const updateFixedExpense = useCallback(
    (id: string, field: "name" | "amount", value: string | number) => {
      setConfig((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          fixedExpenses: prev.fixedExpenses.map((e) =>
            e.id === id ? { ...e, [field]: value } : e
          ),
        };
      });
    },
    []
  );

  const removeFixedExpense = useCallback((id: string) => {
    setConfig((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        fixedExpenses: prev.fixedExpenses.filter((e) => e.id !== id),
      };
    });
  }, []);

  // --- 変動費操作 ---
  const addVariableExpense = useCallback(() => {
    setConfig((prev) => {
      if (!prev) return prev;
      const newItem: VariableExpenseItem = {
        id: crypto.randomUUID(),
        name: "",
        amount: 0,
      };
      return { ...prev, variableExpenses: [...prev.variableExpenses, newItem] };
    });
  }, []);

  const updateVariableExpense = useCallback(
    (id: string, field: "name" | "amount", value: string | number) => {
      setConfig((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          variableExpenses: prev.variableExpenses.map((e) =>
            e.id === id ? { ...e, [field]: value } : e
          ),
        };
      });
    },
    []
  );

  const removeVariableExpense = useCallback((id: string) => {
    setConfig((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        variableExpenses: prev.variableExpenses.filter((e) => e.id !== id),
      };
    });
  }, []);

  // --- サブスク操作 ---
  const addSubscription = useCallback(() => {
    setConfig((prev) => {
      if (!prev) return prev;
      const newItem: SubscriptionItem = {
        id: crypto.randomUUID(),
        name: "",
        amount: 0,
        conversionRate: 5,
        churnRate: 3,
      };
      return { ...prev, subscriptions: [...prev.subscriptions, newItem] };
    });
  }, []);

  const updateSubscription = useCallback(
    (
      id: string,
      field: "name" | "amount" | "conversionRate" | "churnRate",
      value: string | number
    ) => {
      setConfig((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          subscriptions: prev.subscriptions.map((s) =>
            s.id === id ? { ...s, [field]: value } : s
          ),
        };
      });
    },
    []
  );

  const removeSubscription = useCallback((id: string) => {
    setConfig((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        subscriptions: prev.subscriptions.filter((s) => s.id !== id),
      };
    });
  }, []);

  // --- 広告操作 ---
  const addAd = useCallback(() => {
    setConfig((prev) => {
      if (!prev) return prev;
      const newItem: AdItem = {
        id: crypto.randomUUID(),
        name: "",
        amount: 0,
      };
      return { ...prev, ads: [...prev.ads, newItem] };
    });
  }, []);

  const updateAd = useCallback(
    (id: string, field: "name" | "amount", value: string | number) => {
      setConfig((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          ads: prev.ads.map((a) =>
            a.id === id ? { ...a, [field]: value } : a
          ),
        };
      });
    },
    []
  );

  const removeAd = useCallback((id: string) => {
    setConfig((prev) => {
      if (!prev) return prev;
      return { ...prev, ads: prev.ads.filter((a) => a.id !== id) };
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

  const setInitialUsers = useCallback((users: number) => {
    setConfig((prev) => (prev ? { ...prev, initialUsers: users } : prev));
  }, []);

  return {
    config,
    chartData,
    addFixedExpense,
    updateFixedExpense,
    removeFixedExpense,
    addVariableExpense,
    updateVariableExpense,
    removeVariableExpense,
    addSubscription,
    updateSubscription,
    removeSubscription,
    addAd,
    updateAd,
    removeAd,
    setPeriodMonths,
    setMonthlyGrowthRate,
    setInitialUsers,
  };
}
