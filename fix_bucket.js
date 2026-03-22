const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'server/.env' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data, error } = await supabase.storage.updateBucket('avatars', { public: true });
  if (error) {
    console.error("Error setting bucket to public:", error.message);
  } else {
    console.log("Bucket successfully set to public!");
  }
}
run();
