import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface PublicRouteProps {
  children: ReactNode;
}

/**
 * PublicRoute component ensures that authentication pages are always accessible
 * regardless of the authentication state.
 */
export default function PublicRoute({ children }: PublicRouteProps) {
  const { loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin mr-2" />
        <span>Loading...</span>
      </div>
    );
  }

  // Always render children for public routes
  return <>{children}</>;
} 