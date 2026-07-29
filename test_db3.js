import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const kelas = "Kelas 9B";
  const { data: studentsData, error: studentsError } = await supabase
    .from('murid')
    .select('"NISN", "Nama Lengkap", "Kelas"')
    .eq('"Kelas"', kelas);
  console.log(studentsError, studentsData.length);
}
test();
