import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useDeviceId = () => {
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    // Try to get existing device ID from localStorage
    let storedDeviceId = localStorage.getItem('device_id');
    
    if (!storedDeviceId || !isValidDeviceId(storedDeviceId)) {
      // Generate a new UUID-based device ID
      storedDeviceId = generateDeviceId();
      localStorage.setItem('device_id', storedDeviceId);
    }
    
    setDeviceId(storedDeviceId);
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
