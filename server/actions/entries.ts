"use server";
import { createClient } from "../lib/supabase";
import { revalidatePath } from "next/cache";

export async function submitStablefordScore(score: number, date: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Authentication required" };

  const { error: insertError } = await supabase.from('scores').insert({
    user_id: user.id,
    score: score,
    played_at: date
  });

  if (insertError) return { error: insertError.message };

  revalidatePath('/dashboard');
  return { success: true };
}
