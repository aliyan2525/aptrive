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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          criteria: Json
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          criteria?: Json
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          criteria?: Json
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string
          permissions: Json
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          permissions?: Json
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          permissions?: Json
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      admission_deadlines: {
        Row: {
          application_url: string | null
          created_at: string
          deadline_date: string
          entry_test: Database["public"]["Enums"]["entry_test"] | null
          id: string
          notes: string | null
          program: string | null
          university: string
        }
        Insert: {
          application_url?: string | null
          created_at?: string
          deadline_date: string
          entry_test?: Database["public"]["Enums"]["entry_test"] | null
          id?: string
          notes?: string | null
          program?: string | null
          university: string
        }
        Update: {
          application_url?: string | null
          created_at?: string
          deadline_date?: string
          entry_test?: Database["public"]["Enums"]["entry_test"] | null
          id?: string
          notes?: string | null
          program?: string | null
          university?: string
        }
        Relationships: []
      }
      ai_question_assets: {
        Row: {
          approved_by_human: boolean
          asset_type: Database["public"]["Enums"]["ai_asset_type"]
          content: Json
          created_at: string
          generated_at: string
          id: string
          model_used: string | null
          question_id: string
          updated_at: string
        }
        Insert: {
          approved_by_human?: boolean
          asset_type: Database["public"]["Enums"]["ai_asset_type"]
          content?: Json
          created_at?: string
          generated_at?: string
          id?: string
          model_used?: string | null
          question_id: string
          updated_at?: string
        }
        Update: {
          approved_by_human?: boolean
          asset_type?: Database["public"]["Enums"]["ai_asset_type"]
          content?: Json
          created_at?: string
          generated_at?: string
          id?: string
          model_used?: string | null
          question_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_question_assets_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_question_assets_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "v_published_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_study_plans: {
        Row: {
          created_at: string
          generated_at: string
          id: string
          plan: Json
          status: Database["public"]["Enums"]["ai_study_plan_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          generated_at?: string
          id?: string
          plan?: Json
          status?: Database["public"]["Enums"]["ai_study_plan_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          generated_at?: string
          id?: string
          plan?: Json
          status?: Database["public"]["Enums"]["ai_study_plan_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          created_at: string
          id: string
          practice_set_id: string | null
          question_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          practice_set_id?: string | null
          question_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          practice_set_id?: string | null
          question_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_practice_set_id_fkey"
            columns: ["practice_set_id"]
            isOneToOne: false
            referencedRelation: "practice_sets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "v_published_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      chapters: {
        Row: {
          created_at: string
          estimated_minutes: number | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          order_index: number
          slug: string
          subject_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          estimated_minutes?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          order_index?: number
          slug: string
          subject_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          estimated_minutes?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          order_index?: number
          slug?: string
          subject_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapters_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          exam_interest: string | null
          id: string
          message: string
          name: string
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          exam_interest?: string | null
          id?: string
          message: string
          name: string
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          exam_interest?: string | null
          id?: string
          message?: string
          name?: string
          status?: string
        }
        Relationships: []
      }
      difficulty_levels: {
        Row: {
          created_at: string
          id: string
          label: string
          rank: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          rank: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          rank?: number
          updated_at?: string
        }
        Relationships: []
      }
      exam_questions: {
        Row: {
          created_at: string
          id: string
          marks: number
          mock_exam_id: string
          order_index: number
          question_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          marks?: number
          mock_exam_id: string
          order_index?: number
          question_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          marks?: number
          mock_exam_id?: string
          order_index?: number
          question_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_questions_mock_exam_id_fkey"
            columns: ["mock_exam_id"]
            isOneToOne: false
            referencedRelation: "mock_exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "v_published_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_sessions: {
        Row: {
          created_at: string
          id: string
          mock_exam_id: string
          score: number | null
          started_at: string
          status: Database["public"]["Enums"]["exam_session_status"]
          submitted_at: string | null
          total_time_seconds: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mock_exam_id: string
          score?: number | null
          started_at?: string
          status?: Database["public"]["Enums"]["exam_session_status"]
          submitted_at?: string | null
          total_time_seconds?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mock_exam_id?: string
          score?: number | null
          started_at?: string
          status?: Database["public"]["Enums"]["exam_session_status"]
          submitted_at?: string | null
          total_time_seconds?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_sessions_mock_exam_id_fkey"
            columns: ["mock_exam_id"]
            isOneToOne: false
            referencedRelation: "mock_exams"
            referencedColumns: ["id"]
          },
        ]
      }
      import_batch_rows: {
        Row: {
          batch_id: string
          created_at: string
          errors: string[]
          id: string
          question_id: string | null
          raw_data: Json
          row_number: number
          row_status: string
          warnings: string[]
        }
        Insert: {
          batch_id: string
          created_at?: string
          errors?: string[]
          id?: string
          question_id?: string | null
          raw_data: Json
          row_number: number
          row_status?: string
          warnings?: string[]
        }
        Update: {
          batch_id?: string
          created_at?: string
          errors?: string[]
          id?: string
          question_id?: string | null
          raw_data?: Json
          row_number?: number
          row_status?: string
          warnings?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "import_batch_rows_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "import_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "import_batch_rows_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "import_batch_rows_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "v_published_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      import_batches: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string | null
          error_message: string | null
          error_rows: number
          file_name: string
          id: string
          source_type: string
          status: string
          target_practice_set_id: string
          total_rows: number
          valid_rows: number
          warning_rows: number
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          error_message?: string | null
          error_rows?: number
          file_name: string
          id?: string
          source_type?: string
          status?: string
          target_practice_set_id: string
          total_rows?: number
          valid_rows?: number
          warning_rows?: number
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          error_message?: string | null
          error_rows?: number
          file_name?: string
          id?: string
          source_type?: string
          status?: string
          target_practice_set_id?: string
          total_rows?: number
          valid_rows?: number
          warning_rows?: number
        }
        Relationships: [
          {
            foreignKeyName: "import_batches_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "import_batches_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_user_dashboard_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "import_batches_target_practice_set_id_fkey"
            columns: ["target_practice_set_id"]
            isOneToOne: false
            referencedRelation: "practice_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard_snapshots: {
        Row: {
          created_at: string
          id: string
          period_end: string
          period_start: string
          rank: number
          scope: string
          scope_id: string | null
          score: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          period_end: string
          period_start: string
          rank: number
          scope: string
          scope_id?: string | null
          score: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          period_end?: string
          period_start?: string
          rank?: number
          scope?: string
          scope_id?: string | null
          score?: number
          user_id?: string
        }
        Relationships: []
      }
      mock_exams: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          duration_minutes: number
          id: string
          negative_marking_ratio: number | null
          status: Database["public"]["Enums"]["mock_exam_status"]
          test_id: string | null
          title: string
          total_marks: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_minutes: number
          id?: string
          negative_marking_ratio?: number | null
          status?: Database["public"]["Enums"]["mock_exam_status"]
          test_id?: string | null
          title: string
          total_marks: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          negative_marking_ratio?: number | null
          status?: Database["public"]["Enums"]["mock_exam_status"]
          test_id?: string | null
          title?: string
          total_marks?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mock_exams_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mock_exams_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_user_dashboard_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "mock_exams_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link_href: string | null
          read_at: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link_href?: string | null
          read_at?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link_href?: string | null
          read_at?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
      }
      practice_sessions: {
        Row: {
          completed_at: string | null
          correct_count: number
          id: string
          incorrect_count: number
          metadata: Json
          mode: string
          practice_set_id: string | null
          randomized: boolean
          score_percent: number | null
          skipped_count: number
          started_at: string
          status: string
          subject_id: string | null
          time_spent_seconds: number
          timer_enabled: boolean
          total_questions: number
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          correct_count?: number
          id?: string
          incorrect_count?: number
          metadata?: Json
          mode?: string
          practice_set_id?: string | null
          randomized?: boolean
          score_percent?: number | null
          skipped_count?: number
          started_at?: string
          status?: string
          subject_id?: string | null
          time_spent_seconds?: number
          timer_enabled?: boolean
          total_questions?: number
          user_id: string
        }
        Update: {
          completed_at?: string | null
          correct_count?: number
          id?: string
          incorrect_count?: number
          metadata?: Json
          mode?: string
          practice_set_id?: string | null
          randomized?: boolean
          score_percent?: number | null
          skipped_count?: number
          started_at?: string
          status?: string
          subject_id?: string | null
          time_spent_seconds?: number
          timer_enabled?: boolean
          total_questions?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "practice_sessions_practice_set_id_fkey"
            columns: ["practice_set_id"]
            isOneToOne: false
            referencedRelation: "practice_sets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "practice_sessions_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_sets: {
        Row: {
          chapter: string | null
          content_type: string
          created_at: string
          difficulty: string
          estimated_minutes: number
          exam_tag: string | null
          id: string
          is_premium: boolean
          is_solved: boolean
          language: string
          question_count: number
          slug: string
          status: string
          subject_id: string
          title: string
          topic: string
          university: string | null
          updated_at: string
          year: number | null
        }
        Insert: {
          chapter?: string | null
          content_type: string
          created_at?: string
          difficulty: string
          estimated_minutes?: number
          exam_tag?: string | null
          id?: string
          is_premium?: boolean
          is_solved?: boolean
          language?: string
          question_count?: number
          slug: string
          status?: string
          subject_id: string
          title: string
          topic: string
          university?: string | null
          updated_at?: string
          year?: number | null
        }
        Update: {
          chapter?: string | null
          content_type?: string
          created_at?: string
          difficulty?: string
          estimated_minutes?: number
          exam_tag?: string | null
          id?: string
          is_premium?: boolean
          is_solved?: boolean
          language?: string
          question_count?: number
          slug?: string
          status?: string
          subject_id?: string
          title?: string
          topic?: string
          university?: string | null
          updated_at?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "practice_sets_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      question_explanations: {
        Row: {
          content: string
          created_at: string
          id: string
          order_index: number
          question_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          order_index?: number
          question_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          order_index?: number
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_explanations_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_explanations_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "v_published_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      question_formulas: {
        Row: {
          content: string
          created_at: string
          id: string
          order_index: number
          question_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          order_index?: number
          question_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          order_index?: number
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_formulas_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_formulas_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "v_published_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      question_hints: {
        Row: {
          content: string
          created_at: string
          id: string
          order_index: number
          question_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          order_index?: number
          question_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          order_index?: number
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_hints_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_hints_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "v_published_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      question_images: {
        Row: {
          alt_text: string | null
          attached_to: string
          created_at: string
          id: string
          question_id: string
          related_option_id: string | null
          storage_path: string
        }
        Insert: {
          alt_text?: string | null
          attached_to: string
          created_at?: string
          id?: string
          question_id: string
          related_option_id?: string | null
          storage_path: string
        }
        Update: {
          alt_text?: string | null
          attached_to?: string
          created_at?: string
          id?: string
          question_id?: string
          related_option_id?: string | null
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_images_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_images_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "v_published_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      question_options: {
        Row: {
          content: string
          id: string
          is_correct: boolean
          label: string | null
          position: number
          question_id: string
        }
        Insert: {
          content: string
          id?: string
          is_correct?: boolean
          label?: string | null
          position?: number
          question_id: string
        }
        Update: {
          content?: string
          id?: string
          is_correct?: boolean
          label?: string | null
          position?: number
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "v_published_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      question_references: {
        Row: {
          content: string
          created_at: string
          id: string
          order_index: number
          question_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          order_index?: number
          question_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          order_index?: number
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_references_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_references_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "v_published_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      question_reports: {
        Row: {
          created_at: string
          id: string
          question_id: string
          reason: string
          reported_by: string
          status: Database["public"]["Enums"]["question_report_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id: string
          reason: string
          reported_by: string
          status?: Database["public"]["Enums"]["question_report_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          reason?: string
          reported_by?: string
          status?: Database["public"]["Enums"]["question_report_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_reports_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_reports_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "v_published_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      question_reviews: {
        Row: {
          comment: string | null
          created_at: string
          decision: string
          id: string
          question_id: string
          reviewer_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          decision: string
          id?: string
          question_id: string
          reviewer_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          decision?: string
          id?: string
          question_id?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_reviews_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_reviews_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "v_published_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      question_tag_map: {
        Row: {
          question_id: string
          tag_id: string
        }
        Insert: {
          question_id: string
          tag_id: string
        }
        Update: {
          question_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_tag_map_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_tag_map_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "v_published_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_tag_map_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "question_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      question_tags: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      question_versions: {
        Row: {
          change_summary: string | null
          changed_by: string | null
          created_at: string
          id: string
          question_id: string
          snapshot: Json
          version_number: number
        }
        Insert: {
          change_summary?: string | null
          changed_by?: string | null
          created_at?: string
          id?: string
          question_id: string
          snapshot: Json
          version_number: number
        }
        Update: {
          change_summary?: string | null
          changed_by?: string | null
          created_at?: string
          id?: string
          question_id?: string
          snapshot?: Json
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "question_versions_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_versions_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "v_user_dashboard_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "question_versions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_versions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "v_published_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          ai_generated: boolean
          bloom_level: Database["public"]["Enums"]["bloom_level"] | null
          chapter: string | null
          chapter_id: string
          created_at: string
          created_by: string | null
          current_version: number
          difficulty: string
          difficulty_level_id: string | null
          duplicated_from_id: string | null
          explanation: string | null
          human_reviewed: boolean
          id: string
          numeric_answer_tolerance: number | null
          numeric_answer_value: number | null
          position: number
          practice_set_id: string
          prompt: string
          question_type: Database["public"]["Enums"]["question_type"]
          reviewed_by: string | null
          source: string | null
          source_year: number | null
          status: string
          subject_id: string
          subtopic_id: string | null
          tags: string[]
          test_id: string | null
          time_estimate_seconds: number
          topic: string
          topic_id: string
          university_id: string | null
          updated_at: string
        }
        Insert: {
          ai_generated?: boolean
          bloom_level?: Database["public"]["Enums"]["bloom_level"] | null
          chapter?: string | null
          chapter_id: string
          created_at?: string
          created_by?: string | null
          current_version?: number
          difficulty: string
          difficulty_level_id?: string | null
          duplicated_from_id?: string | null
          explanation?: string | null
          human_reviewed?: boolean
          id?: string
          numeric_answer_tolerance?: number | null
          numeric_answer_value?: number | null
          position?: number
          practice_set_id: string
          prompt: string
          question_type?: Database["public"]["Enums"]["question_type"]
          reviewed_by?: string | null
          source?: string | null
          source_year?: number | null
          status?: string
          subject_id: string
          subtopic_id?: string | null
          tags?: string[]
          test_id?: string | null
          time_estimate_seconds?: number
          topic: string
          topic_id: string
          university_id?: string | null
          updated_at?: string
        }
        Update: {
          ai_generated?: boolean
          bloom_level?: Database["public"]["Enums"]["bloom_level"] | null
          chapter?: string | null
          chapter_id?: string
          created_at?: string
          created_by?: string | null
          current_version?: number
          difficulty?: string
          difficulty_level_id?: string | null
          duplicated_from_id?: string | null
          explanation?: string | null
          human_reviewed?: boolean
          id?: string
          numeric_answer_tolerance?: number | null
          numeric_answer_value?: number | null
          position?: number
          practice_set_id?: string
          prompt?: string
          question_type?: Database["public"]["Enums"]["question_type"]
          reviewed_by?: string | null
          source?: string | null
          source_year?: number | null
          status?: string
          subject_id?: string
          subtopic_id?: string | null
          tags?: string[]
          test_id?: string | null
          time_estimate_seconds?: number
          topic?: string
          topic_id?: string
          university_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_user_dashboard_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "questions_difficulty_level_id_fkey"
            columns: ["difficulty_level_id"]
            isOneToOne: false
            referencedRelation: "difficulty_levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_duplicated_from_id_fkey"
            columns: ["duplicated_from_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_duplicated_from_id_fkey"
            columns: ["duplicated_from_id"]
            isOneToOne: false
            referencedRelation: "v_published_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_practice_set_id_fkey"
            columns: ["practice_set_id"]
            isOneToOne: false
            referencedRelation: "practice_sets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "v_user_dashboard_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "questions_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_subtopic_id_fkey"
            columns: ["subtopic_id"]
            isOneToOne: false
            referencedRelation: "subtopics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      recently_viewed: {
        Row: {
          id: string
          resource_id: string
          resource_type: string
          user_id: string
          viewed_at: string
        }
        Insert: {
          id?: string
          resource_id: string
          resource_type: string
          user_id: string
          viewed_at?: string
        }
        Update: {
          id?: string
          resource_id?: string
          resource_type?: string
          user_id?: string
          viewed_at?: string
        }
        Relationships: []
      }
      student_profiles: {
        Row: {
          created_at: string
          daily_study_target_minutes: number
          display_name: string | null
          education_level: Database["public"]["Enums"]["education_level"] | null
          entry_test: Database["public"]["Enums"]["entry_test"] | null
          entry_test_other: string | null
          expected_test_date: string | null
          intermediate_marks: number | null
          intermediate_total: number | null
          matric_marks: number | null
          matric_total: number | null
          onboarding_completed_at: string | null
          preferred_schedule:
            | Database["public"]["Enums"]["study_schedule"]
            | null
          target_degree: string | null
          target_university: string | null
          updated_at: string
          user_id: string
          weak_subjects: string[]
        }
        Insert: {
          created_at?: string
          daily_study_target_minutes?: number
          display_name?: string | null
          education_level?:
            | Database["public"]["Enums"]["education_level"]
            | null
          entry_test?: Database["public"]["Enums"]["entry_test"] | null
          entry_test_other?: string | null
          expected_test_date?: string | null
          intermediate_marks?: number | null
          intermediate_total?: number | null
          matric_marks?: number | null
          matric_total?: number | null
          onboarding_completed_at?: string | null
          preferred_schedule?:
            | Database["public"]["Enums"]["study_schedule"]
            | null
          target_degree?: string | null
          target_university?: string | null
          updated_at?: string
          user_id: string
          weak_subjects?: string[]
        }
        Update: {
          created_at?: string
          daily_study_target_minutes?: number
          display_name?: string | null
          education_level?:
            | Database["public"]["Enums"]["education_level"]
            | null
          entry_test?: Database["public"]["Enums"]["entry_test"] | null
          entry_test_other?: string | null
          expected_test_date?: string | null
          intermediate_marks?: number | null
          intermediate_total?: number | null
          matric_marks?: number | null
          matric_total?: number | null
          onboarding_completed_at?: string | null
          preferred_schedule?:
            | Database["public"]["Enums"]["study_schedule"]
            | null
          target_degree?: string | null
          target_university?: string | null
          updated_at?: string
          user_id?: string
          weak_subjects?: string[]
        }
        Relationships: []
      }
      study_goals: {
        Row: {
          created_at: string
          id: string
          period: Database["public"]["Enums"]["goal_period"]
          period_start: string
          target_minutes: number
          target_questions: number
          target_sessions: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          period: Database["public"]["Enums"]["goal_period"]
          period_start: string
          target_minutes?: number
          target_questions?: number
          target_sessions?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          period?: Database["public"]["Enums"]["goal_period"]
          period_start?: string
          target_minutes?: number
          target_questions?: number
          target_sessions?: number
          user_id?: string
        }
        Relationships: []
      }
      subjects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_coming_soon: boolean
          name: string
          slug: string
          test_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_coming_soon?: boolean
          name: string
          slug: string
          test_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_coming_soon?: boolean
          name?: string
          slug?: string
          test_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subjects_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      subtopics: {
        Row: {
          created_at: string
          estimated_minutes: number | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          order_index: number
          slug: string
          topic_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          estimated_minutes?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          order_index?: number
          slug: string
          topic_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          estimated_minutes?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          order_index?: number
          slug?: string
          topic_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subtopics_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      tests: {
        Row: {
          created_at: string
          description: string | null
          exam_pattern: Json
          id: string
          is_active: boolean
          name: string
          slug: string
          university_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          exam_pattern?: Json
          id?: string
          is_active?: boolean
          name: string
          slug: string
          university_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          exam_pattern?: Json
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          university_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tests_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          chapter_id: string
          created_at: string
          estimated_minutes: number | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          order_index: number
          slug: string
          updated_at: string
        }
        Insert: {
          chapter_id: string
          created_at?: string
          estimated_minutes?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          order_index?: number
          slug: string
          updated_at?: string
        }
        Update: {
          chapter_id?: string
          created_at?: string
          estimated_minutes?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          order_index?: number
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "topics_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      universities: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      university_test_configs: {
        Row: {
          accent_color: string
          created_at: string
          id: string
          is_verified: boolean
          navigation_style: string
          negative_marking: boolean
          negative_marking_fraction: number | null
          sections: Json
          slug: string
          source_url: string | null
          test_name: string
          total_minutes: number
          total_questions: number
          university: string
        }
        Insert: {
          accent_color?: string
          created_at?: string
          id?: string
          is_verified?: boolean
          navigation_style?: string
          negative_marking?: boolean
          negative_marking_fraction?: number | null
          sections?: Json
          slug: string
          source_url?: string | null
          test_name: string
          total_minutes: number
          total_questions: number
          university: string
        }
        Update: {
          accent_color?: string
          created_at?: string
          id?: string
          is_verified?: boolean
          navigation_style?: string
          negative_marking?: boolean
          negative_marking_fraction?: number | null
          sections?: Json
          slug?: string
          source_url?: string | null
          test_name?: string
          total_minutes?: number
          total_questions?: number
          university?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_attempts: {
        Row: {
          attempted_at: string
          created_at: string
          difficulty_at_attempt_id: string | null
          exam_session_id: string | null
          id: string
          is_correct: boolean
          mode: Database["public"]["Enums"]["attempt_mode"]
          numeric_answer_given: number | null
          practice_session_id: string | null
          question_id: string
          selected_option_ids: string[]
          time_taken_seconds: number
          user_id: string
          was_flagged_guess: boolean
          was_skipped: boolean
        }
        Insert: {
          attempted_at?: string
          created_at?: string
          difficulty_at_attempt_id?: string | null
          exam_session_id?: string | null
          id?: string
          is_correct: boolean
          mode?: Database["public"]["Enums"]["attempt_mode"]
          numeric_answer_given?: number | null
          practice_session_id?: string | null
          question_id: string
          selected_option_ids?: string[]
          time_taken_seconds?: number
          user_id: string
          was_flagged_guess?: boolean
          was_skipped?: boolean
        }
        Update: {
          attempted_at?: string
          created_at?: string
          difficulty_at_attempt_id?: string | null
          exam_session_id?: string | null
          id?: string
          is_correct?: boolean
          mode?: Database["public"]["Enums"]["attempt_mode"]
          numeric_answer_given?: number | null
          practice_session_id?: string | null
          question_id?: string
          selected_option_ids?: string[]
          time_taken_seconds?: number
          user_id?: string
          was_flagged_guess?: boolean
          was_skipped?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "user_attempts_difficulty_at_attempt_id_fkey"
            columns: ["difficulty_at_attempt_id"]
            isOneToOne: false
            referencedRelation: "difficulty_levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_attempts_exam_session_id_fkey"
            columns: ["exam_session_id"]
            isOneToOne: false
            referencedRelation: "exam_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_attempts_practice_session_id_fkey"
            columns: ["practice_session_id"]
            isOneToOne: false
            referencedRelation: "practice_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "v_published_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_coins_ledger: {
        Row: {
          coins_amount: number
          created_at: string
          id: string
          source_id: string | null
          source_type: string
          user_id: string
        }
        Insert: {
          coins_amount: number
          created_at?: string
          id?: string
          source_id?: string | null
          source_type: string
          user_id: string
        }
        Update: {
          coins_amount?: number
          created_at?: string
          id?: string
          source_id?: string | null
          source_type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_streaks: {
        Row: {
          current_streak: number
          last_active_date: string | null
          longest_streak: number
          updated_at: string
          user_id: string
        }
        Insert: {
          current_streak?: number
          last_active_date?: string | null
          longest_streak?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          current_streak?: number
          last_active_date?: string | null
          longest_streak?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_topic_progress: {
        Row: {
          accuracy_percent: number | null
          created_at: string
          last_practiced_at: string | null
          mastery_score: number
          questions_attempted: number
          questions_correct: number
          topic_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          accuracy_percent?: number | null
          created_at?: string
          last_practiced_at?: string | null
          mastery_score?: number
          questions_attempted?: number
          questions_correct?: number
          topic_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          accuracy_percent?: number | null
          created_at?: string
          last_practiced_at?: string | null
          mastery_score?: number
          questions_attempted?: number
          questions_correct?: number
          topic_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_topic_progress_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      user_xp_ledger: {
        Row: {
          created_at: string
          id: string
          source_id: string | null
          source_type: string
          user_id: string
          xp_amount: number
        }
        Insert: {
          created_at?: string
          id?: string
          source_id?: string | null
          source_type: string
          user_id: string
          xp_amount: number
        }
        Update: {
          created_at?: string
          id?: string
          source_id?: string | null
          source_type?: string
          user_id?: string
          xp_amount?: number
        }
        Relationships: []
      }
    }
    Views: {
      v_user_topic_progress: {
        Row: {
          accuracy_percent: number | null
          created_at: string
          last_practiced_at: string | null
          mastery_score: number
          questions_attempted: number
          questions_correct: number
          topic_id: string
          updated_at: string
          user_id: string
        }
        Relationships: [
          {
            foreignKeyName: "user_topic_progress_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      goal_progress: {
        Row: {
          actual_minutes: number | null
          actual_questions: number | null
          actual_sessions: number | null
          goal_id: string | null
          period: Database["public"]["Enums"]["goal_period"] | null
          period_start: string | null
          target_minutes: number | null
          target_questions: number | null
          target_sessions: number | null
          user_id: string | null
        }
        Relationships: []
      }
      v_public_question_options: {
        Row: {
          id: string | null
          question_id: string | null
          label: string | null
          content: string | null
          position: number | null
        }
        Relationships: [
          {
            foreignKeyName: "question_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      v_published_questions: {
        Row: {
          chapter: string | null
          difficulty: string | null
          difficulty_rank: number | null
          explanation: string | null
          id: string | null
          position: number | null
          practice_set_id: string | null
          prompt: string | null
          question_type: Database["public"]["Enums"]["question_type"] | null
          status: string | null
          subject_id: string | null
          time_estimate_seconds: number | null
          topic: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_practice_set_id_fkey"
            columns: ["practice_set_id"]
            isOneToOne: false
            referencedRelation: "practice_sets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      v_user_dashboard_summary: {
        Row: {
          user_id: string | null
          activity_date: string | null
          questions_attempted: number | null
          correct_count: number | null
          study_seconds: number | null
          sessions_completed: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_dashboard_data: { Args: { p_user_id: string }; Returns: Json }
      is_admin: { Args: never; Returns: boolean }
      is_staff: { Args: never; Returns: boolean }
      record_attempt_and_update_progress: {
        Args: { attempt: Json }
        Returns: {
          attempted_at: string
          created_at: string
          difficulty_at_attempt_id: string | null
          exam_session_id: string | null
          id: string
          is_correct: boolean
          mode: Database["public"]["Enums"]["attempt_mode"]
          numeric_answer_given: number | null
          practice_session_id: string | null
          question_id: string
          selected_option_ids: string[]
          time_taken_seconds: number
          user_id: string
          was_flagged_guess: boolean
          was_skipped: boolean
        }
        SetofOptions: {
          from: "*"
          to: "user_attempts"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      refresh_leaderboard_snapshot: {
        Args: { p_period_end: string; p_period_start: string; p_scope: string }
        Returns: undefined
      }
    }
    Enums: {
      ai_asset_type:
        | "ai_explanation"
        | "ai_hint"
        | "ai_similar_question"
        | "ai_harder_version"
        | "ai_easier_version"
        | "ai_video_recommendation"
      ai_study_plan_status: "active" | "completed" | "abandoned"
      attempt_mode: "practice" | "mock_exam" | "revision" | "weak_topic"
      bloom_level:
        | "remember"
        | "understand"
        | "apply"
        | "analyze"
        | "evaluate"
        | "create"
      education_level:
        | "matric"
        | "intermediate"
        | "a_levels"
        | "undergraduate"
        | "other"
      entry_test: "NET" | "ECAT" | "MDCAT" | "NAT" | "SAT" | "GAT" | "OTHER"
      exam_session_status:
        | "in_progress"
        | "submitted"
        | "abandoned"
        | "auto_submitted"
      goal_period: "daily" | "weekly"
      mock_exam_status: "draft" | "published" | "archived"
      notification_type:
        | "study_reminder"
        | "admission_deadline"
        | "new_material"
        | "practice_milestone"
        | "achievement_unlocked"
        | "system_announcement"
      question_report_status: "open" | "resolved" | "dismissed"
      question_type: "single_choice" | "multiple_choice" | "numeric"
      study_schedule:
        | "early_morning"
        | "morning"
        | "afternoon"
        | "evening"
        | "night"
        | "flexible"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      ai_asset_type: [
        "ai_explanation",
        "ai_hint",
        "ai_similar_question",
        "ai_harder_version",
        "ai_easier_version",
        "ai_video_recommendation",
      ],
      ai_study_plan_status: ["active", "completed", "abandoned"],
      attempt_mode: ["practice", "mock_exam", "revision", "weak_topic"],
      bloom_level: [
        "remember",
        "understand",
        "apply",
        "analyze",
        "evaluate",
        "create",
      ],
      education_level: [
        "matric",
        "intermediate",
        "a_levels",
        "undergraduate",
        "other",
      ],
      entry_test: ["NET", "ECAT", "MDCAT", "NAT", "SAT", "GAT", "OTHER"],
      exam_session_status: [
        "in_progress",
        "submitted",
        "abandoned",
        "auto_submitted",
      ],
      goal_period: ["daily", "weekly"],
      mock_exam_status: ["draft", "published", "archived"],
      notification_type: [
        "study_reminder",
        "admission_deadline",
        "new_material",
        "practice_milestone",
        "achievement_unlocked",
        "system_announcement",
      ],
      question_report_status: ["open", "resolved", "dismissed"],
      question_type: ["single_choice", "multiple_choice", "numeric"],
      study_schedule: [
        "early_morning",
        "morning",
        "afternoon",
        "evening",
        "night",
        "flexible",
      ],
    },
  },
} as const

export type QuestionStatus = "draft" | "in_review" | "published" | "archived";
export type Difficulty = "Easy" | "Medium" | "Hard";
export type BloomLevel = "remember" | "understand" | "apply" | "analyze" | "evaluate" | "create";
export type QuestionType = "single_choice" | "multiple_choice" | "numeric";
