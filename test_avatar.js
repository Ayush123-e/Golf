const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'server/.env' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data } = await supabase.from('profiles').select('full_name, avatar_url').not('avatar_url', 'is', null).limit(1).single();
  if (!data) return console.log("No profile with an avatar found");
  console.log("Avatar URL found:", data.avatar_url);
  const res = await fetch(data.avatar_url);
  console.log("Fetch status:", res.status);
  if (!res.ok) {
    const text = await res.text();
    console.log("Error body:", text);
  }
}
run();
