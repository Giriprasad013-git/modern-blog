import SEO from '@/components/SEO';
import AuthCallbackHandler from '@/components/auth/AuthCallbackHandler';

export default function AuthCallbackPage() {
  return (
    <div>
      <SEO 
        title="Authentication | Modern Blog"
        description="Completing authentication process."
        noindex={true}
      />
      <AuthCallbackHandler />
    </div>
  );
} 