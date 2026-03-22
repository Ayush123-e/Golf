// @ts-nocheck
/* cspell:ignore apikey supabase SUPABASE */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("Monthly Draw function triggered");

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Environment Variables");
      throw new Error("Missing environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const winningNumbers: number[] = [];
    while (winningNumbers.length < 5) {
      const r = Math.floor(Math.random() * 45) + 1;
      if (!winningNumbers.includes(r)) winningNumbers.push(r);
    }
    console.log("Generated numbers:", winningNumbers);

    const date = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const drawMonth = `${months[date.getMonth()]} ${date.getFullYear()}`;

    const { data: draw, error: drawError } = await supabase
      .from('draws')
      .insert({
        draw_numbers: winningNumbers,
        draw_month: drawMonth,
        draw_type: 'random',
        is_published: true,
        processed_at: date.toISOString()
      })
      .select()
      .single()

    if (drawError) {
      console.error("Draw creation failed:", drawError.message);
      return new Response(JSON.stringify({ error: drawError.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    console.log("Draw created with ID:", draw.id);

    const { data: entries, error: entryError } = await supabase.from('user_draw_entries').select('*').eq('draw_id', draw.id);

    if (entryError) {
      console.error("Failed to fetch entries:", entryError.message);
    }

    if (entries && entries.length > 0) {
      console.log(`Processing ${entries.length} entries`);
      const winnersToInsert = entries
        .map((entry: any) => {
          const matchCount = entry.scores.filter((num: number) => winningNumbers.includes(num)).length;
          if (matchCount >= 3) {
            return {
              user_id: entry.user_id,
              draw_id: draw.id,
              match_count: matchCount,
              status: 'pending'
            };
          }
          return null;
        })
        .filter((w: any) => w !== null);

      if (winnersToInsert.length > 0) {
        console.log(`Found ${winnersToInsert.length} winners, inserting...`);
        const { error: winnerError } = await supabase.from('winners').insert(winnersToInsert);
        if (winnerError) console.error("Winner insert error:", winnerError);
      } else {
        console.log("No winners found this round.");
      }
    } else {
      console.log("No entries for this draw.");
    }

    return new Response(JSON.stringify({ success: true, draw_id: draw.id, numbers: winningNumbers }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })

  } catch (err: any) {
    console.error("Runtime error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
})
