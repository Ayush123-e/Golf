"use server";
import { createClient } from "../lib/supabase";
import { revalidatePath } from "next/cache";

export async function submitStablefordScore(score: number, date: string) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  if (!user) return { error: "Authentication required" };
  
  if (score < 1 || score > 45) {
    return { error: "Invalid score. Stableford points must be between 1 and 45." };
  }

  const { error: insertError } = await supabase.from('scores').insert({
    user_id: user.id,
    score: score,
    played_at: date
  });

  if (insertError) return { error: insertError.message };

  await syncUserDrawEntry(user.id);

  revalidatePath('/dashboard');
  revalidatePath('/draws');
  return { success: true };
}

async function syncUserDrawEntry(userId: string) {
  const { createClient } = await import("../lib/supabase");
  const supabase = await createClient();

  const { data: currentDraw } = await supabase
    .from('draws')
    .select('id')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!currentDraw) return;

  const { data: latestScores } = await supabase
    .from('scores')
    .select('score')
    .eq('user_id', userId)
    .order('played_at', { ascending: false })
    .limit(5);

  if (!latestScores || latestScores.length < 5) return;

  const scoresArray = latestScores.map(s => s.score);

  await supabase
    .from('user_draw_entries')
    .upsert({
      user_id: userId,
      draw_id: currentDraw.id,
      scores: scoresArray
    }, { onConflict: 'user_id, draw_id' });
}

export async function deleteScore(scoreId: string) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  if (!user) return { error: "Authentication required" };

  const { error } = await supabase
    .from('scores')
    .delete()
    .eq('id', scoreId)
    .eq('user_id', user.id);

  if (error) return { error: error.message };

  await syncUserDrawEntry(user.id);
  revalidatePath('/dashboard');
  return { success: true };
}

export async function updateScore(scoreId: string, score: number, date: string) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  if (!user) return { error: "Authentication required" };

  if (score < 1 || score > 45) {
    return { error: "Invalid points. Must be 1-45." };
  }

  const { error } = await supabase
    .from('scores')
    .update({ score, played_at: date })
    .eq('id', scoreId)
    .eq('user_id', user.id);

  if (error) return { error: error.message };

  await syncUserDrawEntry(user.id);
  revalidatePath('/dashboard');
  return { success: true };
}
