import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://qisjuugbxrcjvpdnzxhz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpc2p1dWdieHJjanZwZG56eGh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTI1NTczNywiZXhwIjoyMDg0ODMxNzM3fQ.5oKj5RL6OnI5kw9ciLIjAmxL1dNZwkZTEuijtnSCO5Q';
const supabase = createClient(supabaseUrl, supabaseKey);
async function run() {
  const { data, count, error } = await supabase.from('murid').select('*');
  let realCount = 0;
  let emptyList = [];
  
  for (const d of data || []) {
    if (d['Nama Lengkap'] && d['Nama Lengkap'].trim() !== '') {
      realCount++;
    } else {
      emptyList.push(d.NISN);
    }
  }
  
  // also check next page
  const res2 = await supabase.from('murid').select('*').range(1000, 2000);
  for (const d of res2.data || []) {
    if (d['Nama Lengkap'] && d['Nama Lengkap'].trim() !== '') {
      realCount++;
    } else {
      emptyList.push(d.NISN);
    }
  }
  console.log('Real count:', realCount);
  console.log('Empty count:', emptyList.length);
  
  // Actually delete empty ones
  for (let i = 0; i < emptyList.length; i += 100) {
     const chunk = emptyList.slice(i, i + 100);
     const { error } = await supabase.from('murid').delete().in('NISN', chunk);
     if (error) console.error(error);
  }
  console.log('Deleted empty records');
}
run();
