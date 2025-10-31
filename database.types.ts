export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      companies: {
        Row: {
          created_at: string | null;
          culture: string | null;
          description: string | null;
          founded_year: number | null;
          id: string;
          industry_id: string | null;
          logo_url: string | null;
          name: string;
          updated_at: string | null;
          values: Json | null;
          website: string | null;
        };
        Insert: {
          created_at?: string | null;
          culture?: string | null;
          description?: string | null;
          founded_year?: number | null;
          id?: string;
          industry_id?: string | null;
          logo_url?: string | null;
          name: string;
          updated_at?: string | null;
          values?: Json | null;
          website?: string | null;
        };
        Update: {
          created_at?: string | null;
          culture?: string | null;
          description?: string | null;
          founded_year?: number | null;
          id?: string;
          industry_id?: string | null;
          logo_url?: string | null;
          name?: string;
          updated_at?: string | null;
          values?: Json | null;
          website?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "companies_industry_id_fkey";
            columns: ["industry_id"];
            isOneToOne: false;
            referencedRelation: "industry";
            referencedColumns: ["id"];
          },
        ];
      };
      educations: {
        Row: {
          created_at: string | null;
          degree: string | null;
          description: string | null;
          end_date: string | null;
          field_of_study: string | null;
          grade: string | null;
          id: string;
          institution: string;
          start_date: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          degree?: string | null;
          description?: string | null;
          end_date?: string | null;
          field_of_study?: string | null;
          grade?: string | null;
          id?: string;
          institution: string;
          start_date?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          degree?: string | null;
          description?: string | null;
          end_date?: string | null;
          field_of_study?: string | null;
          grade?: string | null;
          id?: string;
          institution?: string;
          start_date?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      experiences: {
        Row: {
          company: string | null;
          created_at: string | null;
          description: string | null;
          end_date: string | null;
          id: string;
          is_current: boolean | null;
          location: string | null;
          start_date: string | null;
          title: string;
          user_id: string;
        };
        Insert: {
          company?: string | null;
          created_at?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          is_current?: boolean | null;
          location?: string | null;
          start_date?: string | null;
          title: string;
          user_id: string;
        };
        Update: {
          company?: string | null;
          created_at?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          is_current?: boolean | null;
          location?: string | null;
          start_date?: string | null;
          title?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      honors_awards: {
        Row: {
          awarded_on: string | null;
          created_at: string | null;
          description: string | null;
          id: string;
          issuer: string | null;
          name: string;
          user_id: string;
        };
        Insert: {
          awarded_on?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          issuer?: string | null;
          name: string;
          user_id: string;
        };
        Update: {
          awarded_on?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          issuer?: string | null;
          name?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      industry: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      job_positions: {
        Row: {
          category: string;
          company_id: string | null;
          created_at: string | null;
          id: string;
          industry_id: string | null;
          salary_currency: string | null;
          salary_range_max: number | null;
          salary_range_min: number | null;
          seniority_level: string | null;
          title: string;
          typical_requirements: Json | null;
          typical_responsibilities: Json | null;
          updated_at: string | null;
        };
        Insert: {
          category: string;
          company_id?: string | null;
          created_at?: string | null;
          id?: string;
          industry_id?: string | null;
          salary_currency?: string | null;
          salary_range_max?: number | null;
          salary_range_min?: number | null;
          seniority_level?: string | null;
          title: string;
          typical_requirements?: Json | null;
          typical_responsibilities?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          category?: string;
          company_id?: string | null;
          created_at?: string | null;
          id?: string;
          industry_id?: string | null;
          salary_currency?: string | null;
          salary_range_max?: number | null;
          salary_range_min?: number | null;
          seniority_level?: string | null;
          title?: string;
          typical_requirements?: Json | null;
          typical_responsibilities?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "job_positions_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "job_positions_industry_id_fkey";
            columns: ["industry_id"];
            isOneToOne: false;
            referencedRelation: "industry";
            referencedColumns: ["id"];
          },
        ];
      };
      licenses_certifications: {
        Row: {
          created_at: string | null;
          credential_id: string | null;
          credential_url: string | null;
          expiry_date: string | null;
          id: string;
          issue_date: string | null;
          issuer: string | null;
          name: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          credential_id?: string | null;
          credential_url?: string | null;
          expiry_date?: string | null;
          id?: string;
          issue_date?: string | null;
          issuer?: string | null;
          name: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          credential_id?: string | null;
          credential_url?: string | null;
          expiry_date?: string | null;
          id?: string;
          issue_date?: string | null;
          issuer?: string | null;
          name?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          email: string | null;
          full_name: string | null;
          id: string;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          email?: string | null;
          full_name?: string | null;
          id: string;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          created_at: string | null;
          description: string | null;
          end_date: string | null;
          id: string;
          name: string;
          role: string | null;
          skills: string[] | null;
          start_date: string | null;
          url: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          name: string;
          role?: string | null;
          skills?: string[] | null;
          start_date?: string | null;
          url?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          name?: string;
          role?: string | null;
          skills?: string[] | null;
          start_date?: string | null;
          url?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      publications: {
        Row: {
          authors: Json | null;
          created_at: string | null;
          doi: string | null;
          id: string;
          published_on: string | null;
          title: string;
          url: string | null;
          user_id: string;
          venue: string | null;
        };
        Insert: {
          authors?: Json | null;
          created_at?: string | null;
          doi?: string | null;
          id?: string;
          published_on?: string | null;
          title: string;
          url?: string | null;
          user_id: string;
          venue?: string | null;
        };
        Update: {
          authors?: Json | null;
          created_at?: string | null;
          doi?: string | null;
          id?: string;
          published_on?: string | null;
          title?: string;
          url?: string | null;
          user_id?: string;
          venue?: string | null;
        };
        Relationships: [];
      };
      user_languages: {
        Row: {
          created_at: string | null;
          id: string;
          language: string;
          proficiency: Database["public"]["Enums"]["language_proficiency"];
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          language: string;
          proficiency: Database["public"]["Enums"]["language_proficiency"];
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          language?: string;
          proficiency?: Database["public"]["Enums"]["language_proficiency"];
          user_id?: string;
        };
        Relationships: [];
      };
      voice_conversations: {
        Row: {
          agent_id: string | null;
          conversation_id: string;
          created_at: string;
          id: string;
          job_id: string;
          started_at: string | null;
          user_id: string;
        };
        Insert: {
          agent_id?: string | null;
          conversation_id: string;
          created_at?: string;
          id?: string;
          job_id: string;
          started_at?: string | null;
          user_id: string;
        };
        Update: {
          agent_id?: string | null;
          conversation_id?: string;
          created_at?: string;
          id?: string;
          job_id?: string;
          started_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "voice_conversations_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "job_positions";
            referencedColumns: ["id"];
          },
        ];
      };
      volunteering: {
        Row: {
          created_at: string | null;
          description: string | null;
          end_date: string | null;
          id: string;
          organization: string;
          role: string | null;
          start_date: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          organization: string;
          role?: string | null;
          start_date?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          organization?: string;
          role?: string | null;
          start_date?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      language_proficiency:
        | "beginner"
        | "intermediate"
        | "advanced"
        | "fluent"
        | "native";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema =
  DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  } ? keyof (
      & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]][
        "Tables"
      ]
      & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]][
        "Views"
      ]
    )
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
} ? (
    & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]][
      "Tables"
    ]
    & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]][
      "Views"
    ]
  )[TableName] extends {
    Row: infer R;
  } ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (
    & DefaultSchema["Tables"]
    & DefaultSchema["Views"]
  ) ? (
      & DefaultSchema["Tables"]
      & DefaultSchema["Views"]
    )[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    } ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]][
      "Tables"
    ]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]][
    "Tables"
  ][TableName] extends {
    Insert: infer I;
  } ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    } ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]][
      "Tables"
    ]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]][
    "Tables"
  ][TableName] extends {
    Update: infer U;
  } ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    } ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]][
      "Enums"
    ]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][
    EnumName
  ]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[
      PublicCompositeTypeNameOrOptions["schema"]
    ]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]][
    "CompositeTypes"
  ][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {
      language_proficiency: [
        "beginner",
        "intermediate",
        "advanced",
        "fluent",
        "native",
      ],
    },
  },
} as const;
