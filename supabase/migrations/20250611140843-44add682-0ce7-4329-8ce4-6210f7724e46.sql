
-- Create user_devices table to track users by device ID and email
CREATE TABLE public.user_devices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL UNIQUE,
  email TEXT,
  is_subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_type TEXT, -- 'newsletter', 'premium', etc.
  subscription_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_preferences table to store bookmarks, reading list, etc.
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL REFERENCES user_devices(device_id) ON DELETE CASCADE,
  bookmarked_posts TEXT[] DEFAULT '{}',
  reading_list TEXT[] DEFAULT '{}',
  preferred_categories TEXT[] DEFAULT '{}',
  email_frequency TEXT DEFAULT 'weekly',
  notifications JSONB DEFAULT '{"newPosts": true, "comments": false, "digest": true}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(device_id)
);

-- Create user_analytics table to track user behavior
CREATE TABLE public.user_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL REFERENCES user_devices(device_id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB,
  page_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for user_devices (public access for device tracking)
CREATE POLICY "Allow public access to user_devices" 
  ON public.user_devices 
  FOR ALL 
  USING (true);

-- Create policies for user_preferences (public access for device-based preferences)
CREATE POLICY "Allow public access to user_preferences" 
  ON public.user_preferences 
  FOR ALL 
  USING (true);

-- Create policies for user_analytics (public access for analytics)
CREATE POLICY "Allow public access to user_analytics" 
  ON public.user_analytics 
  FOR ALL 
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_user_devices_device_id ON user_devices(device_id);
CREATE INDEX idx_user_devices_email ON user_devices(email);
CREATE INDEX idx_user_preferences_device_id ON user_preferences(device_id);
CREATE INDEX idx_user_analytics_device_id ON user_analytics(device_id);
CREATE INDEX idx_user_analytics_created_at ON user_analytics(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_devices_updated_at BEFORE UPDATE ON user_devices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
