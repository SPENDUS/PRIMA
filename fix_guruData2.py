import re

with open('server.ts', 'r') as f:
    content = f.read()

target = """      const { data: todaysPresensi } = await supabase.from('presensi').select('*').gte('timestamp', `${todayDateStr}T00:00:00Z`).lte('timestamp', `${todayDateStr}T23:59:59Z`);
      let completedKBM = 0;"""

replacement = """      const { data: todaysPresensi } = await supabase.from('presensi').select('*').gte('timestamp', `${todayDateStr}T00:00:00Z`).lte('timestamp', `${todayDateStr}T23:59:59Z`);
      const { data: guruData } = await supabase.from('guru').select('nip, nama_guru');
      let completedKBM = 0;"""

if target in content:
    content = content.replace(target, replacement)
    with open('server.ts', 'w') as f:
        f.write(content)
    print("Fixed guruData2")

