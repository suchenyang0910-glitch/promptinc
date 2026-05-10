import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type Database = {
  public: {
    Tables: {
      game_scores: {
        Row: {
          id: string;
          game_slug: string;
          player_name: string;
          score: number;
          created_at: string;
          user_id: string | null;
          device_hash: string | null;
        };
        Insert: {
          game_slug: string;
          player_name: string;
          score: number;
          user_id?: string | null;
          device_hash?: string | null;
        };
        Update: Partial<{
          game_slug: string;
          player_name: string;
          score: number;
          user_id: string | null;
          device_hash: string | null;
        }>;
        Relationships: [];
      };

      total_scores: {
        Row: {
          game_slug: string;
          player_name: string;
          score: number;
          created_at: string | null;
        };
        Insert: {
          game_slug: string;
          player_name: string;
          score: number;
          created_at?: string | null;
        };
        Update: {
          game_slug?: string;
          player_name?: string;
          score?: number;
          created_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export function getServerSupabase(): SupabaseClient<Database> | null {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const key = serviceKey || anonKey;
  if (!url || !key) return null;

  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
