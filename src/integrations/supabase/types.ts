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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          auto_refresh_enabled: boolean
          base_currency: string
          currency_symbol: string
          default_nisab_basis: string
          gold_price_per_gram: number
          id: string
          nisab_gold_grams: number
          nisab_silver_grams: number
          price_source: string
          price_source_url: string
          prices_updated_at: string
          refresh_interval_minutes: number
          silver_price_per_gram: number
          updated_at: string
          zakat_rate: number
        }
        Insert: {
          auto_refresh_enabled?: boolean
          base_currency?: string
          currency_symbol?: string
          default_nisab_basis?: string
          gold_price_per_gram?: number
          id?: string
          nisab_gold_grams?: number
          nisab_silver_grams?: number
          price_source?: string
          price_source_url?: string
          prices_updated_at?: string
          refresh_interval_minutes?: number
          silver_price_per_gram?: number
          updated_at?: string
          zakat_rate?: number
        }
        Update: {
          auto_refresh_enabled?: boolean
          base_currency?: string
          currency_symbol?: string
          default_nisab_basis?: string
          gold_price_per_gram?: number
          id?: string
          nisab_gold_grams?: number
          nisab_silver_grams?: number
          price_source?: string
          price_source_url?: string
          prices_updated_at?: string
          refresh_interval_minutes?: number
          silver_price_per_gram?: number
          updated_at?: string
          zakat_rate?: number
        }
        Relationships: []
      }
      currency_rates: {
        Row: {
          code: string
          name: string
          rate_per_usd: number
          source: string
          updated_at: string
        }
        Insert: {
          code: string
          name: string
          rate_per_usd: number
          source?: string
          updated_at?: string
        }
        Update: {
          code?: string
          name?: string
          rate_per_usd?: number
          source?: string
          updated_at?: string
        }
        Relationships: []
      }
      educational_content: {
        Row: {
          body_en: string
          body_ur: string
          category: string
          created_at: string
          id: string
          published: boolean
          slug: string
          sort_order: number
          title_en: string
          title_ur: string
          updated_at: string
        }
        Insert: {
          body_en: string
          body_ur?: string
          category?: string
          created_at?: string
          id?: string
          published?: boolean
          slug: string
          sort_order?: number
          title_en: string
          title_ur?: string
          updated_at?: string
        }
        Update: {
          body_en?: string
          body_ur?: string
          category?: string
          created_at?: string
          id?: string
          published?: boolean
          slug?: string
          sort_order?: number
          title_en?: string
          title_ur?: string
          updated_at?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer_en: string
          answer_ur: string
          created_at: string
          id: string
          published: boolean
          question_en: string
          question_ur: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer_en: string
          answer_ur?: string
          created_at?: string
          id?: string
          published?: boolean
          question_en: string
          question_ur?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer_en?: string
          answer_ur?: string
          created_at?: string
          id?: string
          published?: boolean
          question_en?: string
          question_ur?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
