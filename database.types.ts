export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_suggestions: {
        Row: {
          applied_at: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_applied: boolean | null
          model: string | null
          prompt_context: Json | null
          suggested_tasks: Json
          user_id: string
        }
        Insert: {
          applied_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_applied?: boolean | null
          model?: string | null
          prompt_context?: Json | null
          suggested_tasks: Json
          user_id: string
        }
        Update: {
          applied_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_applied?: boolean | null
          model?: string | null
          prompt_context?: Json | null
          suggested_tasks?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_suggestions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_suggestions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_stats"
            referencedColumns: ["user_id"]
          },
        ]
      }
      calendar_connections: {
        Row: {
          access_token: string
          created_at: string | null
          id: string
          is_active: boolean | null
          last_synced_at: string | null
          provider: Database["public"]["Enums"]["calendar_provider"]
          provider_account_email: string | null
          provider_account_id: string
          refresh_token: string | null
          sync_enabled: boolean | null
          sync_errors: number | null
          token_expires_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_synced_at?: string | null
          provider: Database["public"]["Enums"]["calendar_provider"]
          provider_account_email?: string | null
          provider_account_id: string
          refresh_token?: string | null
          sync_enabled?: boolean | null
          sync_errors?: number | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_synced_at?: string | null
          provider?: Database["public"]["Enums"]["calendar_provider"]
          provider_account_email?: string | null
          provider_account_id?: string
          refresh_token?: string | null
          sync_enabled?: boolean | null
          sync_errors?: number | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_connections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_connections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_stats"
            referencedColumns: ["user_id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          all_day: boolean | null
          blocks_scheduling: boolean | null
          calendar_connection_id: string
          created_at: string | null
          description: string | null
          end_time: string
          external_event_id: string
          id: string
          is_task_related: boolean | null
          last_synced_at: string | null
          location: string | null
          start_time: string
          task_id: string | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          all_day?: boolean | null
          blocks_scheduling?: boolean | null
          calendar_connection_id: string
          created_at?: string | null
          description?: string | null
          end_time: string
          external_event_id: string
          id?: string
          is_task_related?: boolean | null
          last_synced_at?: string | null
          location?: string | null
          start_time: string
          task_id?: string | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          all_day?: boolean | null
          blocks_scheduling?: boolean | null
          calendar_connection_id?: string
          created_at?: string | null
          description?: string | null
          end_time?: string
          external_event_id?: string
          id?: string
          is_task_related?: boolean | null
          last_synced_at?: string | null
          location?: string | null
          start_time?: string
          task_id?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_calendar_connection_id_fkey"
            columns: ["calendar_connection_id"]
            isOneToOne: false
            referencedRelation: "calendar_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "v_active_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_stats"
            referencedColumns: ["user_id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          category_id: string | null
          created_at: string | null
          current_tone_index: number | null
          email_enabled: boolean | null
          id: string
          max_per_day: number | null
          push_enabled: boolean | null
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          tone_progression:
            | Database["public"]["Enums"]["notification_tone"][]
            | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          current_tone_index?: number | null
          email_enabled?: boolean | null
          id?: string
          max_per_day?: number | null
          push_enabled?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          tone_progression?:
            | Database["public"]["Enums"]["notification_tone"][]
            | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          current_tone_index?: number | null
          email_enabled?: boolean | null
          id?: string
          max_per_day?: number | null
          push_enabled?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          tone_progression?:
            | Database["public"]["Enums"]["notification_tone"][]
            | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "task_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_stats"
            referencedColumns: ["user_id"]
          },
        ]
      }
      notification_queue: {
        Row: {
          body: string | null
          channel: string
          created_at: string | null
          error_message: string | null
          failed_at: string | null
          id: string
          retry_count: number | null
          scheduled_for: string
          sent_at: string | null
          subject: string | null
          task_id: string | null
          template_data: Json | null
          template_name: string | null
          tone: Database["public"]["Enums"]["notification_tone"] | null
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          channel: string
          created_at?: string | null
          error_message?: string | null
          failed_at?: string | null
          id?: string
          retry_count?: number | null
          scheduled_for: string
          sent_at?: string | null
          subject?: string | null
          task_id?: string | null
          template_data?: Json | null
          template_name?: string | null
          tone?: Database["public"]["Enums"]["notification_tone"] | null
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          channel?: string
          created_at?: string | null
          error_message?: string | null
          failed_at?: string | null
          id?: string
          retry_count?: number | null
          scheduled_for?: string
          sent_at?: string | null
          subject?: string | null
          task_id?: string | null
          template_data?: Json | null
          template_name?: string | null
          tone?: Database["public"]["Enums"]["notification_tone"] | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_queue_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_queue_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "v_active_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_queue_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_queue_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_stats"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          current_theme: string | null
          email: string
          full_name: string | null
          has_pets: boolean | null
          has_plants: boolean | null
          id: string
          last_login_at: string | null
          lives_alone: boolean | null
          locale: string | null
          onboarding_completed: boolean | null
          plays_instruments: boolean | null
          preferred_task_time: string | null
          prefers_dark_mode: boolean | null
          role: Database["public"]["Enums"]["user_role"] | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          current_theme?: string | null
          email: string
          full_name?: string | null
          has_pets?: boolean | null
          has_plants?: boolean | null
          id: string
          last_login_at?: string | null
          lives_alone?: boolean | null
          locale?: string | null
          onboarding_completed?: boolean | null
          plays_instruments?: boolean | null
          preferred_task_time?: string | null
          prefers_dark_mode?: boolean | null
          role?: Database["public"]["Enums"]["user_role"] | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          current_theme?: string | null
          email?: string
          full_name?: string | null
          has_pets?: boolean | null
          has_plants?: boolean | null
          id?: string
          last_login_at?: string | null
          lives_alone?: boolean | null
          locale?: string | null
          onboarding_completed?: boolean | null
          plays_instruments?: boolean | null
          preferred_task_time?: string | null
          prefers_dark_mode?: boolean | null
          role?: Database["public"]["Enums"]["user_role"] | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          created_at: string | null
          endpoint: string
          id: string
          is_active: boolean | null
          keys: Json
          updated_at: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          id?: string
          is_active?: boolean | null
          keys: Json
          updated_at?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          id?: string
          is_active?: boolean | null
          keys?: Json
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "push_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_stats"
            referencedColumns: ["user_id"]
          },
        ]
      }
      streaks: {
        Row: {
          available_breaks: number | null
          completion_rate: number | null
          created_at: string | null
          current_streak: number | null
          earned_breaks: number | null
          id: string
          last_calculated_at: string | null
          last_milestone_at: string | null
          longest_streak: number | null
          next_milestone: number | null
          task_id: string
          total_completions: number | null
          updated_at: string | null
          used_breaks: number | null
          user_id: string
        }
        Insert: {
          available_breaks?: number | null
          completion_rate?: number | null
          created_at?: string | null
          current_streak?: number | null
          earned_breaks?: number | null
          id?: string
          last_calculated_at?: string | null
          last_milestone_at?: string | null
          longest_streak?: number | null
          next_milestone?: number | null
          task_id: string
          total_completions?: number | null
          updated_at?: string | null
          used_breaks?: number | null
          user_id: string
        }
        Update: {
          available_breaks?: number | null
          completion_rate?: number | null
          created_at?: string | null
          current_streak?: number | null
          earned_breaks?: number | null
          id?: string
          last_calculated_at?: string | null
          last_milestone_at?: string | null
          longest_streak?: number | null
          next_milestone?: number | null
          task_id?: string
          total_completions?: number | null
          updated_at?: string | null
          used_breaks?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "streaks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: true
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "streaks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: true
            referencedRelation: "v_active_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "streaks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "streaks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_stats"
            referencedColumns: ["user_id"]
          },
        ]
      }
      task_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_predefined: boolean | null
          name: string
          slug: string
          sort_order: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_predefined?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_predefined?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_categories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_categories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_stats"
            referencedColumns: ["user_id"]
          },
        ]
      }
      task_completions: {
        Row: {
          actual_minutes: number | null
          completed_at: string | null
          created_at: string | null
          id: string
          notes: string | null
          photo_url: string | null
          subtasks_completed: Json | null
          task_id: string
          user_id: string
        }
        Insert: {
          actual_minutes?: number | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          photo_url?: string | null
          subtasks_completed?: Json | null
          task_id: string
          user_id: string
        }
        Update: {
          actual_minutes?: number | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          photo_url?: string | null
          subtasks_completed?: Json | null
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_completions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_completions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "v_active_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_completions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_completions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_stats"
            referencedColumns: ["user_id"]
          },
        ]
      }
      task_subtasks: {
        Row: {
          created_at: string | null
          id: string
          is_required: boolean | null
          sort_order: number | null
          task_id: string
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_required?: boolean | null
          sort_order?: number | null
          task_id: string
          title: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_required?: boolean | null
          sort_order?: number | null
          task_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_subtasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_subtasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "v_active_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          actual_minutes_avg: number | null
          category_id: string | null
          completion_count: number | null
          created_at: string | null
          custom_frequency_days: number | null
          deleted_at: string | null
          description: string | null
          due_date: string | null
          estimated_minutes: number | null
          frequency: Database["public"]["Enums"]["task_frequency"]
          has_subtasks: boolean | null
          id: string
          is_active: boolean | null
          is_archived: boolean | null
          is_recurring: boolean | null
          last_completed_at: string | null
          preferred_time: string | null
          recurrence_pattern: Json | null
          requires_photo_proof: boolean | null
          start_date: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          actual_minutes_avg?: number | null
          category_id?: string | null
          completion_count?: number | null
          created_at?: string | null
          custom_frequency_days?: number | null
          deleted_at?: string | null
          description?: string | null
          due_date?: string | null
          estimated_minutes?: number | null
          frequency?: Database["public"]["Enums"]["task_frequency"]
          has_subtasks?: boolean | null
          id?: string
          is_active?: boolean | null
          is_archived?: boolean | null
          is_recurring?: boolean | null
          last_completed_at?: string | null
          preferred_time?: string | null
          recurrence_pattern?: Json | null
          requires_photo_proof?: boolean | null
          start_date?: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          actual_minutes_avg?: number | null
          category_id?: string | null
          completion_count?: number | null
          created_at?: string | null
          custom_frequency_days?: number | null
          deleted_at?: string | null
          description?: string | null
          due_date?: string | null
          estimated_minutes?: number | null
          frequency?: Database["public"]["Enums"]["task_frequency"]
          has_subtasks?: boolean | null
          id?: string
          is_active?: boolean | null
          is_archived?: boolean | null
          is_recurring?: boolean | null
          last_completed_at?: string | null
          preferred_time?: string | null
          recurrence_pattern?: Json | null
          requires_photo_proof?: boolean | null
          start_date?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "task_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_stats"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      v_active_tasks: {
        Row: {
          actual_minutes_avg: number | null
          available_breaks: number | null
          category_color: string | null
          category_icon: string | null
          category_id: string | null
          category_name: string | null
          completion_count: number | null
          created_at: string | null
          current_streak: number | null
          custom_frequency_days: number | null
          deleted_at: string | null
          description: string | null
          due_date: string | null
          estimated_minutes: number | null
          frequency: Database["public"]["Enums"]["task_frequency"] | null
          has_subtasks: boolean | null
          id: string | null
          is_active: boolean | null
          is_archived: boolean | null
          is_recurring: boolean | null
          last_completed_at: string | null
          longest_streak: number | null
          preferred_time: string | null
          recurrence_pattern: Json | null
          requires_photo_proof: boolean | null
          start_date: string | null
          subtask_count: number | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "task_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_stats"
            referencedColumns: ["user_id"]
          },
        ]
      }
      v_user_stats: {
        Row: {
          active_tasks: number | null
          avg_streak: number | null
          full_name: string | null
          max_streak: number | null
          total_categories: number | null
          total_completions: number | null
          total_tasks: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_task_streak: { Args: { p_task_id: string }; Returns: undefined }
      is_admin: { Args: never; Returns: boolean }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      calendar_provider: "google" | "microsoft" | "apple"
      notification_tone: "encouraging" | "neutral" | "pushy" | "scolding"
      task_frequency: "daily" | "weekly" | "monthly" | "yearly" | "custom"
      user_role: "user" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      calendar_provider: ["google", "microsoft", "apple"],
      notification_tone: ["encouraging", "neutral", "pushy", "scolding"],
      task_frequency: ["daily", "weekly", "monthly", "yearly", "custom"],
      user_role: ["user", "admin"],
    },
  },
} as const
