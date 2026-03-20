import { createClient } from '@supabase/supabase-js';

async function test() {
  console.log('--- GOLF BACKEND: DATABASE CONNECTION TEST ---');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  if (error) {
    if (error.message.includes('fetch')) {
      console.error('❌ Connection Failed: Could not reach Supabase. Check your NEXT_PUBLIC_SUPABASE_URL.');
    } else {
      console.error('❌ Connection Failed:', error.message);
    }
    process.exit(1);
  }

  console.log('✅ Connection Successful!');
  console.log('📊 Active Profiles Count:', count);
  console.log('-------------------------------------------');
}

test();
