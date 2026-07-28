import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://ncfmtzglyxrvdyqcpbvb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jZm10emdseXhydmR5cWNwYnZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxNzkzODIsImV4cCI6MjEwMDc1NTM4Mn0.p-cME1FOf511LFXeTi8yEHT5j3uhiDvb3bl7R6gh7mU';
const supabase = createClient(supabaseUrl, supabaseKey);
async function run() {
  const { data: jadwal } = await supabase.from('jadwal_real').select('*').limit(3);
  console.log("jadwal sample", jadwal);
  
  const { data: gurus } = await supabase.from('guru').select('*').limit(3);
  console.log("guru sample", gurus);
}
run();
