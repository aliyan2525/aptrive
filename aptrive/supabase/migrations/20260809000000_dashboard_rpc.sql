CREATE OR REPLACE FUNCTION get_dashboard_data(p_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result json;
BEGIN
  SELECT json_build_object(
    'streak', (
      SELECT row_to_json(s) 
      FROM (SELECT * FROM user_streaks WHERE user_id = p_user_id LIMIT 1) s
    ),
    'activity', (
      SELECT COALESCE(json_agg(a), '[]'::json) 
      FROM (
        SELECT * FROM v_user_dashboard_summary 
        WHERE user_id = p_user_id 
        AND activity_date >= (CURRENT_DATE - INTERVAL '7 days')::date
      ) a
    ),
    'topic_mastery_strong', (
      SELECT COALESCE(json_agg(t), '[]'::json) 
      FROM (
        SELECT v.*, (SELECT name FROM topics WHERE id = v.topic_id) as topic_name 
        FROM v_user_topic_progress v 
        WHERE user_id = p_user_id 
        ORDER BY mastery_score DESC 
        LIMIT 6
      ) t
    ),
    'topic_mastery_weak', (
      SELECT COALESCE(json_agg(t), '[]'::json) 
      FROM (
        SELECT v.*, (SELECT name FROM topics WHERE id = v.topic_id) as topic_name 
        FROM v_user_topic_progress v 
        WHERE user_id = p_user_id 
        ORDER BY mastery_score ASC 
        LIMIT 5
      ) t
    ),
    'daily_goal', (
      SELECT row_to_json(g) 
      FROM (
        SELECT * FROM goal_progress 
        WHERE user_id = p_user_id 
        AND period = 'daily' 
        AND period_start = CURRENT_DATE 
        LIMIT 1
      ) g
    ),
    'achievements', (
      SELECT COALESCE(json_agg(ach), '[]'::json) 
      FROM (
        SELECT ua.*, 
          json_build_object(
            'name', a.name, 
            'icon', a.icon, 
            'description', a.description
          ) as achievements 
        FROM user_achievements ua 
        LEFT JOIN achievements a ON a.id = ua.achievement_id 
        WHERE ua.user_id = p_user_id 
        ORDER BY ua.earned_at DESC 
        LIMIT 5
      ) ach
    ),
    'deadlines', (
      SELECT COALESCE(json_agg(d), '[]'::json) 
      FROM (
        SELECT * FROM admission_deadlines 
        WHERE deadline_date >= CURRENT_DATE 
        ORDER BY deadline_date ASC 
        LIMIT 4
      ) d
    ),
    'recently_viewed', (
      SELECT COALESCE(json_agg(r), '[]'::json) 
      FROM (
        SELECT * FROM recently_viewed 
        WHERE user_id = p_user_id 
        ORDER BY viewed_at DESC 
        LIMIT 5
      ) r
    ),
    'profile', (
      SELECT row_to_json(p) 
      FROM (SELECT * FROM student_profiles WHERE user_id = p_user_id LIMIT 1) p
    )
  ) INTO v_result;
  
  RETURN v_result;
END;
$$;
