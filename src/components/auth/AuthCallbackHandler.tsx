import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackHandler() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Get the URL hash and parse it
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');
      
      try {
        if (accessToken && refreshToken && type === 'recovery') {
          // Handle password recovery
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (error) {
            throw error;
          }
          
          if (data.session) {
            // Redirect to reset password page
            navigate('/reset-password');
          }
        } else if (type === 'signup' || type === 'magiclink' || type === 'recovery') {
          // Handle other auth types
          const { error } = await supabase.auth.getSession();
          
          if (error) {
            throw error;
          }
          
          // Redirect to home page or dashboard
          navigate('/');
        } else {
          // Handle OAuth callbacks
          const { error } = await supabase.auth.getSession();
          
          if (error) {
            throw error;
          }
          
          // Redirect to home page or dashboard
          navigate('/');
        }
      } catch (err) {
        console.error('Error in auth callback:', err);
        setError('Authentication failed. Please try again.');
        // Redirect to login after a delay
        setTimeout(() => {
          navigate('/signin');
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {error ? (
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <p className="text-gray-600 dark:text-gray-300">Redirecting to login...</p>
        </div>
      ) : (
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mb-4 mx-auto text-accent" />
          <p className="text-gray-600 dark:text-gray-300">Completing authentication...</p>
        </div>
      )}
    </div>
  );
} 