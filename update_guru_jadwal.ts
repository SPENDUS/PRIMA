import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://ncfmtzglyxrvdyqcpbvb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jZm10emdseXhydmR5cWNwYnZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxNzkzODIsImV4cCI6MjEwMDc1NTM4Mn0.p-cME1FOf511LFXeTi8yEHT5j3uhiDvb3bl7R6gh7mU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: jadwal } = await supabase.from('jadwal_real').select('*');
  const guruMap = new Map();
  jadwal?.forEach(j => {
      if (!guruMap.has(j.guru)) {
          guruMap.set(j.guru, { jp: 0, mapels: new Set() });
      }
      guruMap.get(j.guru).jp++;
      guruMap.get(j.guru).mapels.add(j.mapel);
  });
  
  for (const [nip, stats] of guruMap.entries()) {
      const mengajar = Array.from(stats.mapels).join(';');
      const target_jp = stats.jp;
      
      console.log(`Updating ${nip} with mengajar: ${mengajar}, target_jp: ${target_jp}`);
      await supabase.from('guru').update({ mengajar, target_jp }).eq('nip', nip);
  }
  console.log("Done syncing guru with jadwal_real!");
}
run();
