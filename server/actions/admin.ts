"use server";
import { createAdminClient } from "../lib/supabaseServer";

export async function simulateDrawResults(testNumbers: number[]) {
  const supabase = await createAdminClient();

  const { data: allScores } = await supabase
    .from('scores')
    .select('user_id, score');

  const userGroups = allScores?.reduce((acc: any, curr) => {
    if (!acc[curr.user_id]) acc[curr.user_id] = [];
    acc[curr.user_id].push(curr.score);
    return acc;
  }, {});

  const winners = { match5: 0, match4: 0, match3: 0 };

  if (userGroups) {
    Object.values(userGroups).forEach((userScores: any) => {
      const matches = userScores.filter((s: number) => testNumbers.includes(s)).length;
      if (matches === 5) winners.match5++;
      else if (matches === 4) winners.match4++;
      else if (matches === 3) winners.match3++;
    });
  }

  return winners;
}
