'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '../../services/auth.service';
import { useIdleLock } from '../../hooks/useIdleLock';
import PersonalDashboard from '../../components/dashboard/PersonalDashboard';
import CompanyDashboard from '../../components/dashboard/CompanyDashboard';
import SessionLockOverlay from '../../components/auth/SessionLockOverlay';

export default function SimulatorPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { locked, unlock } = useIdleLock(!loading && !!user);

  useEffect(() => {
    // Check if the user is authenticated
    if (!AuthService.isAuthenticated()) {
      router.replace('/auth/login');
      return;
    }

    const sessionUser = AuthService.getSessionUser();
    if (!sessionUser) {
      AuthService.logout();
      router.replace('/auth/login');
      return;
    }

    setUser(sessionUser);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    AuthService.logout();
    router.replace('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center gap-3 text-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Cargando Sucursal Virtual...</p>
      </div>
    );
  }

  const dashboard = user?.docType === 'NIT'
    ? <CompanyDashboard user={user} onLogout={handleLogout} />
    : <PersonalDashboard user={user} onLogout={handleLogout} />;

  return (
    <>
      {dashboard}
      {locked && (
        <SessionLockOverlay
          user={user}
          onUnlock={unlock}
        />
      )}
    </>
  );
}
