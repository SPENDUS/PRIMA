const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data: p } = await supabase.from('presensi').select('kelas').limit(5);
  console.log("Presensi kelas:", p);
  
  const { data: q } = await supabase.from('presensi_qr').select('kelas').limit(5);
  console.log("QR kelas:", q);
}
run();
