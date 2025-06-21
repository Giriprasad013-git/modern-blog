import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useDeviceId } from './useDeviceId';

export interface AnalyticsData {
  totalViews: number;
  totalBookmarks: number;
  totalReadingList: number;
  totalSubscribers: number;
  popularCategories: Array<{ name: string; count: number }>;
  recentActivity: Array<{ type: string; count: number; date: string }>;
}

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 0,
    totalBookmarks: 0,
    totalReadingList: 0,
    totalSubscribers: 0,
    popularCategories: [],
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const deviceId = useDeviceId();

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching analytics data from Supabase...');

      // Get total views from all posts
      const { data: posts } = await supabase
        .from('posts')
        .select('views, category');

      const totalViews = posts?.reduce((sum, post) => sum + (post.views || 0), 0) || 0;
      
      // Get category statistics
      const categoryStats: Record<string, number> = {};
      posts?.forEach(post => {
        if (post.category) {
          categoryStats[post.category] = (categoryStats[post.category] || 0) + 1;
        }
      });

      const popularCategories = Object.entries(categoryStats)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      // Get user preferences from Supabase
      const { data: userPrefs } = await supabase
        .from('user_preferences')
        .select('bookmarked_posts, reading_list')
        .order('updated_at', { ascending: false });

      // Calculate total bookmarks and reading list items
      const totalBookmarks = userPrefs?.reduce((sum, pref) => sum + (pref.bookmarked_posts?.length || 0), 0) || 0;
      const totalReadingList = userPrefs?.reduce((sum, pref) => sum + (pref.reading_list?.length || 0), 0) || 0;

      // Get subscriber count
      const { count: totalSubscribers } = await supabase
        .from('user_devices')
        .select('*', { count: 'exact', head: true })
        .eq('is_subscribed', true);

      // Get recent activity from analytics events
      const { data: recentEvents } = await supabase
        .from('user_analytics')
        .select('event_type, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

      // Group events by type and date (day)
      const eventsByTypeAndDay: Record<string, Record<string, number>> = {};
      recentEvents?.forEach(event => {
        const date = new Date(event.created_at).toISOString().split('T')[0];
        const type = event.event_type;
        
        if (!eventsByTypeAndDay[type]) {
          eventsByTypeAndDay[type] = {};
        }
        
        if (!eventsByTypeAndDay[type][date]) {
          eventsByTypeAndDay[type][date] = 0;
        }
        
        eventsByTypeAndDay[type][date]++;
      });

      // Convert to activity array
      const recentActivity = Object.entries(eventsByTypeAndDay).flatMap(([type, dates]) => 
        Object.entries(dates).map(([date, count]) => ({
          type,
          count,
          date
        }))
      ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      const analyticsData = {
        totalViews,
        totalBookmarks,
        totalReadingList,
        totalSubscribers: totalSubscribers || 0,
        popularCategories,
        recentActivity: recentActivity.slice(0, 10) // Limit to most recent 10 activities
      };

      console.log('Analytics data calculated from Supabase:', analyticsData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (deviceId) {
      fetchAnalytics();
      
      // Refresh analytics every 5 minutes instead of 30 seconds to reduce API calls
      const interval = setInterval(fetchAnalytics, 5 * 60 * 1000);
      
      return () => clearInterval(interval);
    }
  }, [deviceId]);

  return {
    analytics,
    isLoading,
    refetch: fetchAnalytics
  };
};

// Hook to track specific events with improved logging
export const useTrackEvent = () => {
  const deviceId = useDeviceId();
  
  const trackEvent = async (eventType: string, data?: any) => {
    if (!deviceId) return;
    
    // Check for duplicate events in the same session
    const eventKey = `tracked_${eventType}_${JSON.stringify(data || {})}`;
    const recentEventsKey = 'recent_tracked_events';
    const recentEvents = JSON.parse(sessionStorage.getItem(recentEventsKey) || '{}');
    
    // If this exact event was tracked in the last 5 minutes, don't track it again
    const now = Date.now();
    const eventTime = recentEvents[eventKey];
    const fiveMinutesMs = 5 * 60 * 1000;
    
    if (eventTime && (now - eventTime) < fiveMinutesMs) {
      console.log(`Skipping duplicate event: ${eventType}`, data);
      return;
    }
    
    console.log(`Tracking event: ${eventType}`, data);
    
    try {
      // Track event in Supabase
      await supabase
        .from('user_analytics')
        .insert({
          device_id: deviceId,
          event_type: eventType,
          event_data: data,
          page_url: window.location.href,
          created_at: new Date().toISOString()
        });
      
      // Store this event in session storage to prevent duplicates
      recentEvents[eventKey] = now;
      sessionStorage.setItem(recentEventsKey, JSON.stringify(recentEvents));
      
      // Clean up old events (older than 10 minutes)
      const tenMinutesMs = 10 * 60 * 1000;
      const cleanedEvents = Object.fromEntries(
        Object.entries(recentEvents).filter(([_, timestamp]) => 
          (now - (timestamp as number)) < tenMinutesMs
        )
      );
      
      if (Object.keys(cleanedEvents).length !== Object.keys(recentEvents).length) {
        sessionStorage.setItem(recentEventsKey, JSON.stringify(cleanedEvents));
      }
    } catch (error) {
      console.error('Error tracking event in Supabase:', error);
    }
  };

  return { trackEvent };
};
