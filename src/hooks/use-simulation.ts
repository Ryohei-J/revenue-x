"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import type {
  SimulationConfig,
  InitialCostItem,
  FixedExpenseItem,
  VariableExpenseItem,
  TransactionFeeItem,
  SubscriptionItem,
  AdItem,
  OneTimePurchaseItem,
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

  // --- 初期費用操作 ---
  const addInitialCost = useCallback(() => {
    setConfig((prev) => {
      if (!prev) return prev;
      const newItem: InitialCostItem = {
        id: crypto.randomUUID(),
        name: "",
        amount: 0,
      };
      return { ...prev, initialCosts: [...prev.initialCosts, newItem] };
    });
  }, []);

  const updateInitialCost = useCallback(
    (id: string, field: "name" | "amount", value: string | number) => {
      setConfig((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          initialCosts: prev.initialCosts.map((e) =>
            e.id === id ? { ...e, [field]: value } : e
          ),
        };
      });
    },
    []
  );

  const removeInitialCost = useCallback((id: string) => {
    setConfig((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        initialCosts: prev.initialCosts.filter((e) => e.id !== id),
      };
    });
  }, []);

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

  // --- 決済手数料操作 ---
  const addTransactionFee = useCallback(() => {
    setConfig((prev) => {
      if (!prev) return prev;
      const newItem: TransactionFeeItem = {
        id: crypto.randomUUID(),
        name: "",
        rate: 0,
      };
      return { ...prev, transactionFees: [...prev.transactionFees, newItem] };
    });
  }, []);

  const updateTransactionFee = useCallback(
    (id: string, field: "name" | "rate", value: string | number) => {
      setConfig((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          transactionFees: prev.transactionFees.map((f) =>
            f.id === id ? { ...f, [field]: value } : f
          ),
        };
      });
    },
    []
  );

  const removeTransactionFee = useCallback((id: string) => {
    setConfig((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        transactionFees: prev.transactionFees.filter((f) => f.id !== id),
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

  // --- 買い切り操作 ---
  const addOneTimePurchase = useCallback(() => {
    setConfig((prev) => {
      if (!prev) return prev;
      const newItem: OneTimePurchaseItem = {
        id: crypto.randomUUID(),
        name: "",
        amount: 0,
        conversionRate: 10,
      };
      return { ...prev, oneTimePurchases: [...prev.oneTimePurchases, newItem] };
    });
  }, []);

  const updateOneTimePurchase = useCallback(
    (
      id: string,
      field: "name" | "amount" | "conversionRate",
      value: string | number
    ) => {
      setConfig((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          oneTimePurchases: prev.oneTimePurchases.map((o) =>
            o.id === id ? { ...o, [field]: value } : o
          ),
        };
      });
    },
    []
  );

  const removeOneTimePurchase = useCallback((id: string) => {
    setConfig((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        oneTimePurchases: prev.oneTimePurchases.filter((o) => o.id !== id),
      };
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
    addInitialCost,
    updateInitialCost,
    removeInitialCost,
    addFixedExpense,
    updateFixedExpense,
    removeFixedExpense,
    addVariableExpense,
    updateVariableExpense,
    removeVariableExpense,
    addTransactionFee,
    updateTransactionFee,
    removeTransactionFee,
    addSubscription,
    updateSubscription,
    removeSubscription,
    addAd,
    updateAd,
    removeAd,
    addOneTimePurchase,
    updateOneTimePurchase,
    removeOneTimePurchase,
    setPeriodMonths,
    setMonthlyGrowthRate,
    setInitialUsers,
  };
}
