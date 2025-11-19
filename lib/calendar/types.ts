/**
 * Calendar Integration Types
 */

export type CalendarProvider = "google" | "microsoft" | "apple";

export interface CalendarConnection {
  id: string;
  user_id: string;
  provider: CalendarProvider;
  email: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface CalendarEvent {
  id: string;
  calendar_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  all_day: boolean;
  location?: string;
  attendees?: string[];
  external_id?: string;
  provider?: CalendarProvider;
}

export interface CalendarSyncStatus {
  connection_id: string;
  last_sync: string;
  next_sync: string;
  events_synced: number;
  sync_errors: number;
}
