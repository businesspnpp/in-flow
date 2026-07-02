import type { ReactNode } from 'react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { DashboardHeaderProvider } from '@/components/dashboard/DashboardHeaderContext';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardHeaderProvider>
      <DashboardShell>{children}</DashboardShell>
    </DashboardHeaderProvider>
  );
}
