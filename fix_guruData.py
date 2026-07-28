import re

with open('server.ts', 'r') as f:
    content = f.read()

target = """      const { data: todaysPresensi } = await supabase.from('presensi').select('*').gte('timestamp', `${todayDateStr}T00:00:00Z`).lte('timestamp', `${todayDateStr}T23:59:59Z`);

      let completedKBM = 0;
      const notYetTaught: any[] = [];
      const absentStudents: any[] = [];

      if (todaysSchedule) {
        const nipToName: Record<string, string> = {};
        if (guruData) guruData.forEach(g => { nipToName[g.nip] = g.nama_guru; });"""

replacement = """      const { data: todaysPresensi } = await supabase.from('presensi').select('*').gte('timestamp', `${todayDateStr}T00:00:00Z`).lte('timestamp', `${todayDateStr}T23:59:59Z`);
      const { data: guruData } = await supabase.from('guru').select('nip, nama_guru');

      let completedKBM = 0;
      const notYetTaught: any[] = [];
      const absentStudents: any[] = [];

      if (todaysSchedule) {
        const nipToName: Record<string, string> = {};
        if (guruData) guruData.forEach(g => { nipToName[g.nip] = g.nama_guru; });"""

if target in content:
    content = content.replace(target, replacement)
else:
    print("Failed to fix guruData")
    
# also check nip in 1571
target_nip = """      if (namaGuru) {
        query = query.eq('guru', nip || namaGuru);
      }"""
replacement_nip = """      if (namaGuru) {
        query = query.eq('guru', namaGuru);
      }"""
      
if target_nip in content:
    content = content.replace(target_nip, replacement_nip)
else:
    print("Failed to fix nip")

with open('server.ts', 'w') as f:
    f.write(content)

