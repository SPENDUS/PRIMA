import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const kelas = "Kelas 9B";
  const jurnalKelas = String(kelas).toUpperCase().replace('KELAS', '').trim();
  const { data: jurnalData, error: jurnalError } = await supabase.from('jurnal').select('kelas, timestamp, ketidakhadiran, jam_pembelajaran').eq('kelas', jurnalKelas);
  console.log(jurnalError, jurnalData);
}
test();
