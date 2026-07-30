import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { data: tables, error } = await supabase.rpc('get_tables'); // Or just fetch a few rows from something to see
  const { data, error: err2 } = await supabase.from('guru_BK').select('*').limit(1);
  console.log("guru_BK:", err2, data);
}
test();
