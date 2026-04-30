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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      adm_regions: {
        Row: {
          api_url: string | null
          country_code: string
          country_name: string | null
          id: string
          region_code: string
          region_name: string
          shape_name: string | null
        }
        Insert: {
          api_url?: string | null
          country_code: string
          country_name?: string | null
          id?: string
          region_code: string
          region_name: string
          shape_name?: string | null
        }
        Update: {
          api_url?: string | null
          country_code?: string
          country_name?: string | null
          id?: string
          region_code?: string
          region_name?: string
          shape_name?: string | null
        }
        Relationships: []
      }
      companion_applications: {
        Row: {
          applicant_id: string
          companion_id: string
          created_at: string
          decided_at: string | null
          decided_by: string | null
          decision_message: string | null
          decision_read_at: string | null
          id: string
          message: string | null
          status: Database["public"]["Enums"]["companion_application_status"]
          status_ord: number | null
          updated_at: string
        }
        Insert: {
          applicant_id: string
          companion_id: string
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          decision_message?: string | null
          decision_read_at?: string | null
          id?: string
          message?: string | null
          status?: Database["public"]["Enums"]["companion_application_status"]
          status_ord?: number | null
          updated_at?: string
        }
        Update: {
          applicant_id?: string
          companion_id?: string
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          decision_message?: string | null
          decision_read_at?: string | null
          id?: string
          message?: string | null
          status?: Database["public"]["Enums"]["companion_application_status"]
          status_ord?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "companion_applications_applicant_user_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "companion_applications_companion_id_fkey"
            columns: ["companion_id"]
            isOneToOne: false
            referencedRelation: "companions"
            referencedColumns: ["id"]
          },
        ]
      }
      companion_regions: {
        Row: {
          companion_id: string
          country_code: string
          country_name: string
          created_at: string
          id: string
          region_code: string
          region_name: string
          shape_name: string | null
        }
        Insert: {
          companion_id: string
          country_code: string
          country_name: string
          created_at?: string
          id?: string
          region_code: string
          region_name: string
          shape_name?: string | null
        }
        Update: {
          companion_id?: string
          country_code?: string
          country_name?: string
          created_at?: string
          id?: string
          region_code?: string
          region_name?: string
          shape_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "travel_companion_regions_companion_id_fkey"
            columns: ["companion_id"]
            isOneToOne: false
            referencedRelation: "companions"
            referencedColumns: ["id"]
          },
        ]
      }
      companions: {
        Row: {
          accepted_count: number
          companion_count: number
          content: string
          created_at: string
          deadline_at: string
          end_date: string
          gender_preference: string
          id: string
          is_full: boolean
          place: string
          start_date: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          accepted_count?: number
          companion_count: number
          content: string
          created_at?: string
          deadline_at: string
          end_date: string
          gender_preference: string
          id?: string
          is_full?: boolean
          place: string
          start_date: string
          title: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          accepted_count?: number
          companion_count?: number
          content?: string
          created_at?: string
          deadline_at?: string
          end_date?: string
          gender_preference?: string
          id?: string
          is_full?: boolean
          place?: string
          start_date?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "companions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      diaries: {
        Row: {
          created_at: string | null
          drawing_content: string | null
          id: string
          is_drawing: boolean
          is_public: boolean | null
          is_report: boolean
          text_content: string | null
          title: string | null
          travel_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          drawing_content?: string | null
          id?: string
          is_drawing?: boolean
          is_public?: boolean | null
          is_report?: boolean
          text_content?: string | null
          title?: string | null
          travel_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          drawing_content?: string | null
          id?: string
          is_drawing?: boolean
          is_public?: boolean | null
          is_report?: boolean
          text_content?: string | null
          title?: string | null
          travel_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diaries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      diary_images: {
        Row: {
          created_at: string | null
          diary_id: string
          id: string
          url: string
        }
        Insert: {
          created_at?: string | null
          diary_id: string
          id?: string
          url: string
        }
        Update: {
          created_at?: string | null
          diary_id?: string
          id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "diary_images_diary_id_fkey"
            columns: ["diary_id"]
            isOneToOne: false
            referencedRelation: "diaries"
            referencedColumns: ["id"]
          },
        ]
      }
      diary_regions: {
        Row: {
          country_code: string
          country_name: string
          created_at: string | null
          diary_id: string
          region_code: string
          region_name: string
          shape_name: string | null
        }
        Insert: {
          country_code: string
          country_name: string
          created_at?: string | null
          diary_id: string
          region_code: string
          region_name: string
          shape_name?: string | null
        }
        Update: {
          country_code?: string
          country_name?: string
          created_at?: string | null
          diary_id?: string
          region_code?: string
          region_name?: string
          shape_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diary_regions_diary_id_fkey"
            columns: ["diary_id"]
            isOneToOne: false
            referencedRelation: "diaries"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          data: Json | null
          id: string
          title: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          data?: Json | null
          id?: string
          title: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          data?: Json | null
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      plan_items: {
        Row: {
          created_at: string | null
          day_number: number
          id: string
          memo: string | null
          place: string | null
          plan_id: string
          time: string
          title: string
        }
        Insert: {
          created_at?: string | null
          day_number: number
          id?: string
          memo?: string | null
          place?: string | null
          plan_id: string
          time: string
          title: string
        }
        Update: {
          created_at?: string | null
          day_number?: number
          id?: string
          memo?: string | null
          place?: string | null
          plan_id?: string
          time?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_items_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "travel_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      travel_plans: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          region_names: { id: string; region_name: string }[]
          start_date: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          region_names?: { id: string; region_name: string }[]
          start_date: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          region_names?: { id: string; region_name: string }[]
          start_date?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          about: string | null
          apple_refresh_token: string | null
          created_at: string | null
          email: string
          expo_push_token: string | null
          gender: string | null
          id: string
          nickname: string | null
          platform: string | null
          profile_image: string | null
          year_of_birth: string | null
        }
        Insert: {
          about?: string | null
          apple_refresh_token?: string | null
          created_at?: string | null
          email: string
          expo_push_token?: string | null
          gender?: string | null
          id: string
          nickname?: string | null
          platform?: string | null
          profile_image?: string | null
          year_of_birth?: string | null
        }
        Update: {
          about?: string | null
          apple_refresh_token?: string | null
          created_at?: string | null
          email?: string
          expo_push_token?: string | null
          gender?: string | null
          id?: string
          nickname?: string | null
          platform?: string | null
          profile_image?: string | null
          year_of_birth?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_counters: {
        Args: { p_user_id: string }
        Returns: {
          applied_count: number
          diaries_count: number
          public_diaries_count: number
          received_count: number
        }[]
      }
    }
    Enums: {
      companion_application_status:
        | "pending"
        | "accepted"
        | "rejected"
        | "cancelled"
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
      companion_application_status: [
        "pending",
        "accepted",
        "rejected",
        "cancelled",
      ],
    },
  },
} as const
