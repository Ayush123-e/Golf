import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

Deno.serve(async (req) => {
  const winningNumbers: number[] = [];
  while(winningNumbers.length < 5) {
    const r = Math.floor(Math.random() * 45) + 1;
    if(!winningNumbers.includes(r)) winningNumbers.push(r);
  }

  const { data: draw, error: drawError } = await supabase
    .from('draws')
    .insert({ 
      draw_numbers: winningNumbers, 
      is_published: true,
      processed_at: new Date().toISOString()
    })
    .select()
    .single()

  if (drawError) return new Response(JSON.stringify({ error: drawError.message }), { status: 500 });

  const { data: entries } = await supabase.from('user_draw_entries').select('*').eq('draw_id', draw.id);

  if (entries) {
    for (const entry of entries) {
      const matchCount = entry.scores.filter((num: number) => winningNumbers.includes(num)).length;
      if (matchCount >= 3) {
        await supabase.from('winners').insert({
          user_id: entry.user_id,
          draw_id: draw.id,
          match_count: matchCount,
          status: 'pending'
        });
      }
    }
  }

  return new Response(JSON.stringify({ success: true, draw_id: draw.id, numbers: winningNumbers }), {
    headers: { "Content-Type": "application/json" },
  })
})
