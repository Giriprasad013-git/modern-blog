
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useDeviceId } from './useDeviceId';

export interface SupabaseUserPreferences {
  bookmarkedPosts: string[];
  readingList: string[];
  preferredCategories: string[];
  emailFrequency: 'daily' | 'weekly' | 'monthly';
  notifications: {
    newPosts: boolean;
    comments: boolean;
    digest: boolean;
  };
}

const defaultPreferences: SupabaseUserPreferences = {
  bookmarkedPosts: [],
  readingList: [],
  preferredCategories: [],
  emailFrequency: 'weekly',
  notifications: {
    newPosts: true,
    comments: false,
    digest: true,
  },
};

export const useSupabaseUserPreferences = () => {
  const deviceId = useDeviceId();
  const [preferences, setPreferences] = useState<SupabaseUserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (!deviceId) return;

    const loadUserPreferences = async () => {
      try {
        // Check if user exists and get subscription status
        const { data: userData, error: userError } = await supabase
          .from('user_devices')
          .select('*')
          .eq('device_id', deviceId)
          .maybeSingle();

        if (userError && userError.code !== 'PGRST116') {
          console.error('Error fetching user data:', userError);
        }

        if (userData) {
          setIsSubscribed(userData.is_subscribed);
          
          // Update last seen
          await supabase
            .from('user_devices')
            .update({ last_seen: new Date().toISOString() })
            .eq('device_id', deviceId);
        } else {
          // Create new user device entry
          await supabase
            .from('user_devices')
            .insert({
              device_id: deviceId,
              is_subscribed: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              last_seen: new Date().toISOString()
            });
        }

        // Load user preferences
        const { data: prefsData, error: prefsError } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('device_id', deviceId)
          .maybeSingle();

        if (prefsError && prefsError.code !== 'PGRST116') {
          console.error('Error fetching preferences:', prefsError);
        }

        if (prefsData) {
          // Safely parse notifications with proper type checking
          let notifications = defaultPreferences.notifications;
          if (prefsData.notifications && typeof prefsData.notifications === 'object' && !Array.isArray(prefsData.notifications)) {
            const notifData = prefsData.notifications as any;
            notifications = {
              newPosts: typeof notifData.newPosts === 'boolean' ? notifData.newPosts : defaultPreferences.notifications.newPosts,
              comments: typeof notifData.comments === 'boolean' ? notifData.comments : defaultPreferences.notifications.comments,
              digest: typeof notifData.digest === 'boolean' ? notifData.digest : defaultPreferences.notifications.digest,
            };
          }

          setPreferences({
            bookmarkedPosts: prefsData.bookmarked_posts || [],
            readingList: prefsData.reading_list || [],
            preferredCategories: prefsData.preferred_categories || [],
            emailFrequency: prefsData.email_frequency as 'daily' | 'weekly' | 'monthly' || 'weekly',
            notifications,
          });
        } else {
          // Create default preferences
          await supabase
            .from('user_preferences')
            .insert({
              device_id: deviceId,
              bookmarked_posts: [],
              reading_list: [],
              preferred_categories: [],
              email_frequency: 'weekly',
              notifications: defaultPreferences.notifications,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
        }
      } catch (error) {
        console.error('Error loading user preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserPreferences();
  }, [deviceId]);

  const savePreferences = async (newPreferences: SupabaseUserPreferences) => {
    if (!deviceId) return;

    try {
      setPreferences(newPreferences);

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          device_id: deviceId,
          bookmarked_posts: newPreferences.bookmarkedPosts,
          reading_list: newPreferences.readingList,
          preferred_categories: newPreferences.preferredCategories,
          email_frequency: newPreferences.emailFrequency,
          notifications: newPreferences.notifications,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving preferences:', error);
      }
    } catch (error) {
      console.error('Error in savePreferences:', error);
    }
  };

  const addBookmark = async (slug: string) => {
    const newPreferences = {
      ...preferences,
      bookmarkedPosts: [...preferences.bookmarkedPosts, slug],
    };
    await savePreferences(newPreferences);
  };

  const removeBookmark = async (slug: string) => {
    const newPreferences = {
      ...preferences,
      bookmarkedPosts: preferences.bookmarkedPosts.filter(s => s !== slug),
    };
    await savePreferences(newPreferences);
  };

  const isBookmarked = (slug: string) => {
    return preferences.bookmarkedPosts.includes(slug);
  };

  const addToReadingList = async (slug: string) => {
    const newPreferences = {
      ...preferences,
      readingList: [...preferences.readingList, slug],
    };
    await savePreferences(newPreferences);
  };

  const removeFromReadingList = async (slug: string) => {
    const newPreferences = {
      ...preferences,
      readingList: preferences.readingList.filter(s => s !== slug),
    };
    await savePreferences(newPreferences);
  };

  const isInReadingList = (slug: string) => {
    return preferences.readingList.includes(slug);
  };

  const updateSubscriptionStatus = async (email?: string, subscriptionType: string = 'newsletter') => {
    if (!deviceId) return;

    try {
      setIsSubscribed(true);

      const updateData: any = {
        is_subscribed: true,
        subscription_date: new Date().toISOString(),
        subscription_type: subscriptionType,
        updated_at: new Date().toISOString()
      };

      if (email) {
        updateData.email = email;
      }

      const { error } = await supabase
        .from('user_devices')
        .update(updateData)
        .eq('device_id', deviceId);

      if (error) {
        console.error('Error updating subscription status:', error);
      }

      // Track subscription event
      await supabase
        .from('user_analytics')
        .insert({
          device_id: deviceId,
          event_type: 'newsletter_subscription',
          event_data: { email, subscription_type: subscriptionType },
          page_url: window.location.href,
          created_at: new Date().toISOString()
        });

    } catch (error) {
      console.error('Error in updateSubscriptionStatus:', error);
    }
  };

  const trackEvent = async (eventType: string, eventData?: any) => {
    if (!deviceId) return;

    try {
      await supabase
        .from('user_analytics')
        .insert({
          device_id: deviceId,
          event_type: eventType,
          event_data: eventData,
          page_url: window.location.href,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };

  return {
    preferences,
    isLoading,
    isSubscribed,
    deviceId,
    addBookmark,
    removeBookmark,
    isBookmarked,
    addToReadingList,
    removeFromReadingList,
    isInReadingList,
    updateSubscriptionStatus,
    trackEvent,
    savePreferences,
  };
};
