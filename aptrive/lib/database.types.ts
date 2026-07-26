// Hand-authored types matching supabase/migrations/0001–0003.
// Shaped like `supabase gen types typescript` output, so this can be
// dropped in as-is now and replaced 1:1 by the CLI-generated file
// later (`supabase gen types typescript --local > lib/database.types.ts`)
// without touching any calling code.

export type Difficulty = "Easy" | "Medium" | "Hard";
export type Language = "English" | "Urdu";
export type ContentType =
  | "mcq"
  | "topic-wise"
  | "chapter-wise"
  | "past-papers"
  | "solved-papers"
  | "mock-tests"
  | "formula-sheets"
  | "revision-notes"
  | "pdf"
  | "video"
  | "flashcards"
  | "ai-generated"
  | "daily-challenge";
export type UserRole = "student" | "instructor" | "content_manager" | "administrator";
export type SessionMode = "practice" | "mock" | "exam" | "daily-challenge";
export type SessionStatus = "in_progress" | "completed" | "abandoned";
export type RecentlyViewedType = "practice_set" | "question" | "video" | "pdf";

// -- Admin CMS (0005_admin_cms_foundation) -----------------------
export type QuestionStatus = "draft" | "in_review" | "published" | "archived";
export type PracticeSetStatus = "draft" | "published" | "archived";
export type ImportBatchStatus =
  | "validating"
  | "ready"
  | "importing"
  | "completed"
  | "failed"
  | "rolled_back";
export type ImportRowStatus = "pending" | "valid" | "warning" | "error";

// -- Phase 0 Custom Types ----------------------------------------
export type BloomLevel = "remember" | "understand" | "apply" | "analyze" | "evaluate" | "create";
export type QuestionType = "single_choice" | "multiple_choice" | "numeric";
export type AdminRole = "super_admin" | "content_manager" | "moderator" | "content_creator" | "reviewer";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };

      subjects: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          is_coming_soon: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["subjects"]["Row"]> & {
          slug: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["subjects"]["Row"]>;
      };

      practice_sets: {
        Row: {
          id: string;
          slug: string;
          subject_id: string;
          title: string;
          content_type: ContentType;
          university: string | null;
          exam_tag: string | null;
          topic: string;
          chapter: string | null;
          difficulty: Difficulty;
          year: number | null;
          language: Language;
          is_solved: boolean;
          is_premium: boolean;
          question_count: number;
          estimated_minutes: number;
          status: PracticeSetStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["practice_sets"]["Row"]> & {
          slug: string;
          subject_id: string;
          title: string;
          content_type: ContentType;
          topic: string;
          difficulty: Difficulty;
        };
        Update: Partial<Database["public"]["Tables"]["practice_sets"]["Row"]>;
      };

      questions: {
        Row: {
          id: string;
          practice_set_id: string;
          subject_id: string;
          prompt: string;
          explanation: string | null;
          difficulty: Difficulty;
          topic: string;
          chapter: string | null;
          time_estimate_seconds: number;
          position: number;
          status: QuestionStatus;
          source: string | null;
          source_year: number | null;
          tags: string[];
          ai_generated: boolean;
          human_reviewed: boolean;
          current_version: number;
          created_by: string | null;
          reviewed_by: string | null;
          duplicated_from_id: string | null;
          created_at: string;
          updated_at: string;
          // Relational Extensions (Phase 0)
          university_id: string | null;
          test_id: string | null;
          chapter_id: string;
          topic_id: string;
          subtopic_id: string | null;
          difficulty_level_id: string;
          bloom_level: BloomLevel;
          question_type: QuestionType;
          numeric_answer_value: number | null;
          numeric_answer_tolerance: number | null;
        };
        Insert: Partial<Database["public"]["Tables"]["questions"]["Row"]> & {
          practice_set_id: string;
          subject_id: string;
          prompt: string;
          difficulty: Difficulty;
          topic: string;
          chapter_id: string;
          topic_id: string;
          difficulty_level_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["questions"]["Row"]>;
      };

      question_versions: {
        Row: {
          id: string;
          question_id: string;
          version_number: number;
          snapshot: Record<string, unknown>;
          changed_by: string | null;
          change_summary: string | null;
          created_at: string;
        };
        Insert: never; // system-maintained via trigger
        Update: never;
      };

      question_options: {
        Row: {
          id: string;
          question_id: string;
          label: string | null;
          content: string;
          is_correct: boolean;
          position: number;
        };
        Insert: Partial<Database["public"]["Tables"]["question_options"]["Row"]> & {
          question_id: string;
          content: string;
        };
        Update: Partial<Database["public"]["Tables"]["question_options"]["Row"]>;
      };

      practice_sessions: {
        Row: {
          id: string;
          user_id: string;
          practice_set_id: string | null;
          subject_id: string | null;
          mode: SessionMode;
          status: SessionStatus;
          total_questions: number;
          correct_count: number;
          incorrect_count: number;
          skipped_count: number;
          score_percent: number | null;
          time_spent_seconds: number;
          timer_enabled: boolean;
          randomized: boolean;
          started_at: string;
          completed_at: string | null;
          metadata: Record<string, unknown>;
        };
        Insert: Partial<Database["public"]["Tables"]["practice_sessions"]["Row"]> & {
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["practice_sessions"]["Row"]>;
      };

      question_responses: {
        Row: {
          id: string;
          session_id: string;
          user_id: string;
          question_id: string;
          selected_option_id: string | null;
          is_correct: boolean;
          flagged_for_review: boolean;
          time_spent_seconds: number;
          answered_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["question_responses"]["Row"]> & {
          session_id: string;
          user_id: string;
          question_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["question_responses"]["Row"]>;
      };

      topic_mastery: {
        Row: {
          id: string;
          user_id: string;
          subject_id: string | null;
          topic: string;
          questions_attempted: number;
          questions_correct: number;
          mastery_percent: number;
          last_practiced_at: string | null;
          updated_at: string;
        };
        Insert: never; // system-maintained via trigger
        Update: never;
      };

      daily_activity: {
        Row: {
          id: string;
          user_id: string;
          activity_date: string;
          questions_attempted: number;
          correct_count: number;
          study_seconds: number;
          sessions_completed: number;
        };
        Insert: never; // system-maintained via trigger
        Update: never;
      };

      study_streaks: {
        Row: {
          user_id: string;
          current_streak: number;
          longest_streak: number;
          last_active_date: string | null;
          updated_at: string;
        };
        Insert: never; // system-maintained via trigger
        Update: never;
      };

      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          question_id: string | null;
          practice_set_id: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["bookmarks"]["Row"]> & {
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["bookmarks"]["Row"]>;
      };

      recently_viewed: {
        Row: {
          id: string;
          user_id: string;
          resource_type: RecentlyViewedType;
          resource_id: string;
          viewed_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["recently_viewed"]["Row"]> & {
          user_id: string;
          resource_type: RecentlyViewedType;
          resource_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["recently_viewed"]["Row"]>;
      };

      achievements: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          icon: string | null;
          criteria: Record<string, unknown>;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["achievements"]["Row"]> & {
          slug: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["achievements"]["Row"]>;
      };

      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          earned_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["user_achievements"]["Row"]> & {
          user_id: string;
          achievement_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_achievements"]["Row"]>;
      };

      student_profiles: {
        Row: {
          id: string;
          user_id: string;
          display_name: string | null;
          target_university: string | null;
          target_program: string | null;
          entry_test: string | null;
          education_level: string | null;
          matric_marks: number | null;
          intermediate_marks: number | null;
          expected_test_date: string | null;
          preferred_study_schedule: string | null;
          daily_study_target_minutes: number;
          improvement_subjects: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["student_profiles"]["Row"]> & {
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["student_profiles"]["Row"]>;
      };

      goal_progress: {
        Row: {
          id: string;
          user_id: string;
          period: "daily" | "weekly" | "monthly";
          period_start: string;
          target_questions: number;
          completed_questions: number;
          target_minutes: number;
          completed_minutes: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["goal_progress"]["Row"]> & {
          user_id: string;
          period: "daily" | "weekly" | "monthly";
          period_start: string;
        };
        Update: Partial<Database["public"]["Tables"]["goal_progress"]["Row"]>;
      };

      admission_deadlines: {
        Row: {
          id: string;
          university: string;
          program: string | null;
          deadline_date: string;
          label: string;
          source_url: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["admission_deadlines"]["Row"]> & {
          university: string;
          deadline_date: string;
          label: string;
        };
        Update: Partial<Database["public"]["Tables"]["admission_deadlines"]["Row"]>;
      };

      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string;
          notification_type: "reminder" | "deadline" | "achievement" | "material" | "system";
          read_at: string | null;
          action_url: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["notifications"]["Row"]> & {
          user_id: string;
          title: string;
          body: string;
          notification_type: "reminder" | "deadline" | "achievement" | "material" | "system";
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Row"]>;
      };

      import_batches: {
        Row: {
          id: string;
          created_by: string | null;
          file_name: string;
          source_type: "csv";
          target_practice_set_id: string;
          status: ImportBatchStatus;
          total_rows: number;
          valid_rows: number;
          warning_rows: number;
          error_rows: number;
          error_message: string | null;
          created_at: string;
          completed_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["import_batches"]["Row"]> & {
          file_name: string;
          target_practice_set_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["import_batches"]["Row"]>;
      };

      import_batch_rows: {
        Row: {
          id: string;
          batch_id: string;
          row_number: number;
          raw_data: Record<string, string>;
          row_status: ImportRowStatus;
          errors: string[];
          warnings: string[];
          question_id: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["import_batch_rows"]["Row"]> & {
          batch_id: string;
          row_number: number;
          raw_data: Record<string, string>;
        };
        Update: Partial<Database["public"]["Tables"]["import_batch_rows"]["Row"]>;
      };

      // -- Phase 0 Catalog & Question Metadata Tables ------------------
      universities: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          description: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["universities"]["Row"]> & {
          name: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["universities"]["Row"]>;
      };

      tests: {
        Row: {
          id: string;
          university_id: string | null;
          name: string;
          slug: string;
          description: string | null;
          exam_pattern: Record<string, unknown>;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["tests"]["Row"]> & {
          name: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["tests"]["Row"]>;
      };

      difficulty_levels: {
        Row: {
          id: string;
          label: string;
          rank: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["difficulty_levels"]["Row"]> & {
          label: string;
          rank: number;
        };
        Update: Partial<Database["public"]["Tables"]["difficulty_levels"]["Row"]>;
      };

      chapters: {
        Row: {
          id: string;
          subject_id: string;
          name: string;
          slug: string;
          order_index: number;
          icon: string | null;
          estimated_minutes: number | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["chapters"]["Row"]> & {
          subject_id: string;
          name: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["chapters"]["Row"]>;
      };

      topics: {
        Row: {
          id: string;
          chapter_id: string;
          name: string;
          slug: string;
          order_index: number;
          icon: string | null;
          estimated_minutes: number | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["topics"]["Row"]> & {
          chapter_id: string;
          name: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["topics"]["Row"]>;
      };

      subtopics: {
        Row: {
          id: string;
          topic_id: string;
          name: string;
          slug: string;
          order_index: number;
          icon: string | null;
          estimated_minutes: number | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["subtopics"]["Row"]> & {
          topic_id: string;
          name: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["subtopics"]["Row"]>;
      };

      admin_users: {
        Row: {
          user_id: string;
          role: AdminRole;
          permissions: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["admin_users"]["Row"]> & {
          user_id: string;
          role: AdminRole;
        };
        Update: Partial<Database["public"]["Tables"]["admin_users"]["Row"]>;
      };

      question_images: {
        Row: {
          id: string;
          question_id: string;
          storage_path: string;
          alt_text: string | null;
          attached_to: "question" | "option" | "explanation";
          related_option_id: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["question_images"]["Row"]> & {
          question_id: string;
          storage_path: string;
          attached_to: "question" | "option" | "explanation";
        };
        Update: Partial<Database["public"]["Tables"]["question_images"]["Row"]>;
      };

      question_tags: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["question_tags"]["Row"]> & {
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["question_tags"]["Row"]>;
      };

      question_tag_map: {
        Row: {
          question_id: string;
          tag_id: string;
        };
        Insert: {
          question_id: string;
          tag_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["question_tag_map"]["Row"]>;
      };

      question_explanations: {
        Row: {
          id: string;
          question_id: string;
          content: string;
          order_index: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["question_explanations"]["Row"]> & {
          question_id: string;
          content: string;
        };
        Update: Partial<Database["public"]["Tables"]["question_explanations"]["Row"]>;
      };

      question_hints: {
        Row: {
          id: string;
          question_id: string;
          content: string;
          order_index: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["question_hints"]["Row"]> & {
          question_id: string;
          content: string;
        };
        Update: Partial<Database["public"]["Tables"]["question_hints"]["Row"]>;
      };

      question_formulas: {
        Row: {
          id: string;
          question_id: string;
          content: string;
          order_index: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["question_formulas"]["Row"]> & {
          question_id: string;
          content: string;
        };
        Update: Partial<Database["public"]["Tables"]["question_formulas"]["Row"]>;
      };

      question_references: {
        Row: {
          id: string;
          question_id: string;
          content: string;
          order_index: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["question_references"]["Row"]> & {
          question_id: string;
          content: string;
        };
        Update: Partial<Database["public"]["Tables"]["question_references"]["Row"]>;
      };

      question_reviews: {
        Row: {
          id: string;
          question_id: string;
          reviewer_id: string;
          decision: "approved" | "rejected" | "changes_requested";
          comment: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["question_reviews"]["Row"]> & {
          question_id: string;
          reviewer_id: string;
          decision: "approved" | "rejected" | "changes_requested";
        };
        Update: Partial<Database["public"]["Tables"]["question_reviews"]["Row"]>;
      };

      // -- user_attempts new path (0008/0009) --------------------------
      // NOTE: hand-authored against the ticket's description of
      // already-existing infrastructure that wasn't present in the
      // repo snapshot this was written against — see the header
      // comment in 0008_user_attempts_foundation.sql. Re-generate this
      // block from the real schema (`supabase gen types typescript`)
      // once available rather than trusting it verbatim.
      exam_sessions: {
        Row: {
          id: string;
          user_id: string;
          test_id: string | null;
          status: "in_progress" | "completed" | "abandoned";
          total_questions: number;
          started_at: string;
          completed_at: string | null;
          metadata: Record<string, unknown>;
        };
        Insert: Partial<Database["public"]["Tables"]["exam_sessions"]["Row"]> & {
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["exam_sessions"]["Row"]>;
      };

      user_attempts: {
        Row: {
          id: string;
          user_id: string;
          exam_session_id: string | null;
          practice_session_id: string | null;
          question_id: string;
          selected_option_ids: string[] | null;
          numeric_answer_given: number | null;
          is_correct: boolean;
          time_taken_seconds: number;
          xp_awarded: number;
          attempted_at: string;
        };
        // No client-writable policy — every row is written exclusively
        // through the record_attempt_and_update_progress RPC.
        Insert: never;
        Update: never;
      };

      user_topic_progress: {
        Row: {
          id: string;
          user_id: string;
          subject_id: string | null;
          topic: string;
          questions_attempted: number;
          questions_correct: number;
          mastery_percent: number;
          last_practiced_at: string | null;
          updated_at: string;
        };
        Insert: never; // system-maintained via record_attempt_and_update_progress
        Update: never;
      };

      user_xp_ledger: {
        Row: {
          id: string;
          user_id: string;
          attempt_id: string | null;
          source: "question_attempt" | "achievement" | "bonus";
          xp_delta: number;
          created_at: string;
        };
        Insert: never; // system-maintained via record_attempt_and_update_progress
        Update: never;
      };

      user_streaks: {
        Row: {
          user_id: string;
          current_streak: number;
          longest_streak: number;
          last_active_date: string | null;
          updated_at: string;
        };
        Insert: never; // system-maintained via record_attempt_and_update_progress
        Update: never;
      };
    };
    Views: {
      v_user_dashboard_summary: {
        Row: {
          user_id: string;
          activity_date: string;
          questions_attempted: number;
          correct_count: number;
          study_seconds: number;
          sessions_completed: number;
        };
      };
    };
    Functions: {
      record_attempt_and_update_progress: {
        Args: { attempt: Record<string, unknown> };
        Returns: {
          is_correct: boolean;
          correct_option_ids: string[] | null;
          correct_numeric_value: number | null;
          xp_awarded: number;
        };
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
