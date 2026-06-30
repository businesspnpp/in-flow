'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type DashboardHeaderConfig = {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  actions?: ReactNode;
};

type DashboardHeaderContextValue = {
  headerConfig: DashboardHeaderConfig;
  setHeaderConfig: (next: DashboardHeaderConfig) => void;
  clearHeaderConfig: () => void;
};

const DashboardHeaderContext = createContext<DashboardHeaderContextValue | null>(null);

export function DashboardHeaderProvider({ children }: { children: ReactNode }) {
  const [headerConfig, setHeaderConfigState] = useState<DashboardHeaderConfig>({});

  const setHeaderConfig = useCallback((next: DashboardHeaderConfig) => {
    setHeaderConfigState(next);
  }, []);

  const clearHeaderConfig = useCallback(() => {
    setHeaderConfigState({});
  }, []);

  const value = useMemo<DashboardHeaderContextValue>(
    () => ({
      headerConfig,
      setHeaderConfig,
      clearHeaderConfig,
    }),
    [clearHeaderConfig, headerConfig, setHeaderConfig],
  );

  return <DashboardHeaderContext.Provider value={value}>{children}</DashboardHeaderContext.Provider>;
}

export function useDashboardHeader() {
  const context = useContext(DashboardHeaderContext);
  if (!context) {
    throw new Error('useDashboardHeader must be used within DashboardHeaderProvider');
  }
  return context;
}
