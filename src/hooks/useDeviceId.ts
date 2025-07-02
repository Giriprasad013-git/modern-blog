import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';

export const useDeviceId = () => {
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    const setupDeviceId = async () => {
      // First, check if user is authenticated with Supabase
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      
      if (user) {
        // If authenticated, use the user's ID as the device ID
        setDeviceId(user.id);
        // Still store in localStorage as a fallback
        localStorage.setItem('device_id', user.id);
        return;
      }
      
      // If not authenticated, try to get existing device ID from localStorage
      let storedDeviceId = localStorage.getItem('device_id');
      
      if (!storedDeviceId || !isValidDeviceId(storedDeviceId)) {
        // Generate a new UUID-based device ID
        storedDeviceId = generateDeviceId();
        localStorage.setItem('device_id', storedDeviceId);
      }
      
      setDeviceId(storedDeviceId);
    };
    
    setupDeviceId();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      if (user) {
        setDeviceId(user.id);
        localStorage.setItem('device_id', user.id);
      } else {
        // Revert to stored device ID if logged out
        const storedDeviceId = localStorage.getItem('device_id');
        if (storedDeviceId && isValidDeviceId(storedDeviceId)) {
          setDeviceId(storedDeviceId);
        } else {
          const newDeviceId = generateDeviceId();
          localStorage.setItem('device_id', newDeviceId);
          setDeviceId(newDeviceId);
        }
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Generate a proper UUID-based device ID
  const generateDeviceId = (): string => {
    try {
      // Try to use the crypto API for more secure random values if available
      return uuidv4();
    } catch (error) {
      // Fallback to a less secure but still reasonably unique ID
      return `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
  };

  // Validate that the device ID is properly formatted
  const isValidDeviceId = (id: string): boolean => {
    // Check if it's a valid UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(id)) return true;
    
    // Or check if it's our fallback format
    const fallbackRegex = /^device_\d+_[a-z0-9]+$/;
    return fallbackRegex.test(id);
  };

  return deviceId;
};
