import { redirect } from 'next/navigation';
import { verifySession } from '@/lib/auth-server';
import DashboardContent from './DashboardContent';

export default async function DashboardPage() {
  const user = await verifySession();

  if (!user) {
    redirect('/login');
  }

  return <DashboardContent />;
}
