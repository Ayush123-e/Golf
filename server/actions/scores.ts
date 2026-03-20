"use server";

import { createClient } from "../lib/supabase";
import { revalidatePath } from "next/cache";

export async function submitGolfScore(score: number, date: string) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Please login first." };

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_active_subscriber, role')
    .eq('id', user.id)
    .single();

  if (!profile?.is_active_subscriber && profile?.role !== 'admin') {
    return { error: "Only active subscribers can enter scores." };
  }

  if (score < 1 || score > 45) return { error: "Invalid score range." };

  const { error } = await supabase.from('scores').insert({
    user_id: user.id,
    score: score,
    played_at: date
  });

  if (error) return { error: "Database error: " + error.message };

  revalidatePath('/dashboard');
  return { success: true };
}
