const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data } = await supabase.from('murid').select('"Nama Lengkap", "Kelas"').limit(5);
  console.log(JSON.stringify(data, null, 2));
}
run();
