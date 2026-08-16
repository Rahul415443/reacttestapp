import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAppSelector((state) => state.auth);
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
