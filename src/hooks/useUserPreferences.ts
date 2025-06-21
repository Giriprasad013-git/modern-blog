
import { useState, useEffect } from 'react';
import { Post } from '@/types/post';
import { useSupabaseUserPreferences } from './useSupabaseUserPreferences';

export interface UserPreferences {
  bookmarkedPosts: string[]; // post slugs
  readingList: string[];
  preferredCategories: string[];
  emailFrequency: 'daily' | 'weekly' | 'monthly';
  notifications: {
    newPosts: boolean;
    comments: boolean;
    digest: boolean;
  };
}

const defaultPreferences: UserPreferences = {
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

export const useUserPreferences = () => {
  const supabasePrefs = useSupabaseUserPreferences();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  // Migrate local preferences to Supabase if they exist
  useEffect(() => {
    const migrateLocalPreferences = async () => {
      if (supabasePrefs.isLoading || !supabasePrefs.deviceId) return;

      const localPreferences = localStorage.getItem('userPreferences');
      
      if (localPreferences && supabasePrefs.preferences.bookmarkedPosts.length === 0) {
        try {
          const parsed = JSON.parse(localPreferences);
          await supabasePrefs.savePreferences(parsed);
          localStorage.removeItem('userPreferences'); // Clean up local storage
          console.log('Migrated local preferences to Supabase');
        } catch (error) {
          console.error('Error migrating local preferences:', error);
        }
      }

      setPreferences(supabasePrefs.preferences);
      setIsLoading(false);
    };

    migrateLocalPreferences();
  }, [supabasePrefs.isLoading, supabasePrefs.deviceId, supabasePrefs.preferences]);

  const savePreferences = (newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
    supabasePrefs.savePreferences(newPreferences);
  };

  const addBookmark = (slug: string) => {
    supabasePrefs.addBookmark(slug);
  };

  const removeBookmark = (slug: string) => {
    supabasePrefs.removeBookmark(slug);
  };

  const isBookmarked = (slug: string) => {
    return supabasePrefs.isBookmarked(slug);
  };

  const addToReadingList = (slug: string) => {
    supabasePrefs.addToReadingList(slug);
  };

  const removeFromReadingList = (slug: string) => {
    supabasePrefs.removeFromReadingList(slug);
  };

  const isInReadingList = (slug: string) => {
    return supabasePrefs.isInReadingList(slug);
  };

  const updateNotificationSettings = (notifications: UserPreferences['notifications']) => {
    const newPreferences = {
      ...preferences,
      notifications,
    };
    savePreferences(newPreferences);
  };

  return {
    preferences,
    isLoading,
    isSubscribed: supabasePrefs.isSubscribed,
    deviceId: supabasePrefs.deviceId,
    addBookmark,
    removeBookmark,
    isBookmarked,
    addToReadingList,
    removeFromReadingList,
    isInReadingList,
    updateNotificationSettings,
    updateSubscriptionStatus: supabasePrefs.updateSubscriptionStatus,
    trackEvent: supabasePrefs.trackEvent,
    savePreferences,
  };
};
