"use server";

import { createClient } from "../lib/supabase";

export async function getLeaderboard() {
  try {
    const supabase = await createClient();

    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .not('rolling_avg', 'is', null)
      .gt('rolling_avg', 0)
      .order('rolling_avg', { ascending: false })
      .limit(50);

    if (error) {
      console.error("Leaderboard fetch error details:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return { error: error.message || "Schema synchronization in progress", profiles: [] };
    }
    
    return { profiles: profiles || [] };
  } catch (err: any) {
    console.error("Leaderboard critical failure:", err);
    return { error: "Service temporarily unavailable", profiles: [] };
  }
}
