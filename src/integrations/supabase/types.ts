export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      post_tags: {
        Row: {
          id: number
          post_id: number
          tag_id: number
        }
        Insert: {
          id?: number
          post_id: number
          tag_id: number
        }
        Update: {
          id?: number
          post_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author: string
          category: string
          content: string
          created_at: string | null
          date: string
          excerpt: string
          id: number
          image: string
          read_time: number
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
          views: number
        }
        Insert: {
          author: string
          category: string
          content: string
          created_at?: string | null
          date: string
          excerpt: string
          id?: number
          image: string
          read_time: number
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          views?: number
        }
        Update: {
          author?: string
          category?: string
          content?: string
          created_at?: string | null
          date?: string
          excerpt?: string
          id?: number
          image?: string
          read_time?: number
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          views?: number
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          id: number
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_analytics: {
        Row: {
          created_at: string
          device_id: string
          event_data: Json | null
          event_type: string
          id: string
          page_url: string | null
        }
        Insert: {
          created_at?: string
          device_id: string
          event_data?: Json | null
          event_type: string
          id?: string
          page_url?: string | null
        }
        Update: {
          created_at?: string
          device_id?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          page_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_analytics_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "user_devices"
            referencedColumns: ["device_id"]
          },
        ]
      }
      user_devices: {
        Row: {
          created_at: string
          device_id: string
          email: string | null
          id: string
          is_subscribed: boolean
          last_seen: string | null
          subscription_date: string | null
          subscription_type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          device_id: string
          email?: string | null
          id?: string
          is_subscribed?: boolean
          last_seen?: string | null
          subscription_date?: string | null
          subscription_type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          device_id?: string
          email?: string | null
          id?: string
          is_subscribed?: boolean
          last_seen?: string | null
          subscription_date?: string | null
          subscription_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          bookmarked_posts: string[] | null
          created_at: string
          device_id: string
          email_frequency: string | null
          id: string
          notifications: Json | null
          preferred_categories: string[] | null
          reading_list: string[] | null
          updated_at: string
        }
        Insert: {
          bookmarked_posts?: string[] | null
          created_at?: string
          device_id: string
          email_frequency?: string | null
          id?: string
          notifications?: Json | null
          preferred_categories?: string[] | null
          reading_list?: string[] | null
          updated_at?: string
        }
        Update: {
          bookmarked_posts?: string[] | null
          created_at?: string
          device_id?: string
          email_frequency?: string | null
          id?: string
          notifications?: Json | null
          preferred_categories?: string[] | null
          reading_list?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: true
            referencedRelation: "user_devices"
            referencedColumns: ["device_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      populate_tags_from_posts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
