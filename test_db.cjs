const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data } = await supabase.from('jurnal').select('id, timestamp, kelas, catatan_mengajar, mata_pelajaran');
  console.log(JSON.stringify(data.filter(d => d.catatan_mengajar && d.catatan_mengajar !== '[]' && d.catatan_mengajar !== 'Nihil'), null, 2));
}
run();
