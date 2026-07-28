import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qisjuugbxrcjvpdnzxhz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpc2p1dWdieHJjanZwZG56eGh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTI1NTczNywiZXhwIjoyMDg0ODMxNzM3fQ.5oKj5RL6OnI5kw9ciLIjAmxL1dNZwkZTEuijtnSCO5Q';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: student } = await supabase.from('murid').select('*').eq('"Nama Lengkap"', 'ABDUL AZIS').single();

  if (student) {
    const { data: journals } = await supabase.from('jurnal').select('id, timestamp, ketidakhadiran').eq('kelas', student['Kelas']);
    console.log('Journals:');
    journals?.forEach(j => {
      console.log(j.timestamp, j.ketidakhadiran);
    });
  }
}
run();
