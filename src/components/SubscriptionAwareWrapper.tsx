
import { ReactNode } from 'react';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface SubscriptionAwareWrapperProps {
  children: ReactNode;
  hideForSubscribed?: boolean;
}

const SubscriptionAwareWrapper = ({ children, hideForSubscribed = false }: SubscriptionAwareWrapperProps) => {
  const { isSubscribed, isLoading } = useUserPreferences();

  // Show loading state
  if (isLoading) {
    return null;
  }

  // Hide content for subscribed users if specified
  if (hideForSubscribed && isSubscribed) {
    return null;
  }

  return <>{children}</>;
};

export default SubscriptionAwareWrapper;
