import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://qisjuugbxrcjvpdnzxhz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpc2p1dWdieHJjanZwZG56eGh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTI1NTczNywiZXhwIjoyMDg0ODMxNzM3fQ.5oKj5RL6OnI5kw9ciLIjAmxL1dNZwkZTEuijtnSCO5Q';
const supabase = createClient(supabaseUrl, supabaseKey);
async function run() {
  const { data, error } = await supabase.from('murid').select('NISN, "Nama Lengkap"').range(1000, 1100);
  console.log('Next page size:', data?.length);
  if (data?.length) console.log(data[0]);
}
run();
