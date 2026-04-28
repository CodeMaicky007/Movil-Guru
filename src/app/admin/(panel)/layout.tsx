import { requireUser } from '@/lib/auth';
import AdminShell from './shell';

export const dynamic = 'force-dynamic';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return <AdminShell user={user}>{children}</AdminShell>;
}
