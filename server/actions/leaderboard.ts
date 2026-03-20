"use server";
import { createClient } from "../lib/supabase";

export async function getLeaderboard() {
  const supabase = await createClient();

  const { data: allScores, error } = await supabase
    .from('scores')
    .select(`
      score,
      user_id,
      profiles (full_name, avatar_url)
    `);

  if (error) return { error: error.message };

  const userStats = allScores.reduce((acc: any, curr: any) => {
    if (!acc[curr.user_id]) {
      acc[curr.user_id] = {
        name: curr.profiles?.full_name || 'Anonymous',
        avatar: curr.profiles?.avatar_url,
        scores: []
      };
    }
    acc[curr.user_id].scores.push(curr.score);
    return acc;
  }, {});

  const leaderboard = Object.values(userStats).map((user: any) => {
    const avg = user.scores.reduce((a: number, b: number) => a + b, 0) / user.scores.length;
    return {
      name: user.name,
      avatar: user.avatar,
      avgScore: parseFloat(avg.toFixed(1)),
      gameCount: user.scores.length
    };
  }).sort((a, b) => b.avgScore - a.avgScore);

  return leaderboard;
}
