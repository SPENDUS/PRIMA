import re

with open('server.ts', 'r') as f:
    content = f.read()

# Fix guruData in api/admin/main-stats
target_1 = """      const { data: todaysPresensi } = await supabase.from('presensi').select('*').gte('timestamp', `${todayDateStr}T00:00:00Z`).lte('timestamp', `${todayDateStr}T23:59:59Z`);

      let completedKBM = 0;
      const notYetTaught: any[] = [];
      const absentStudents: any[] = [];

      if (todaysSchedule) {
        const nipToName: Record<string, string> = {};
        if (guruData) guruData.forEach(g => { nipToName[g.nip] = g.nama_guru; });"""

replacement_1 = """      const { data: todaysPresensi } = await supabase.from('presensi').select('*').gte('timestamp', `${todayDateStr}T00:00:00Z`).lte('timestamp', `${todayDateStr}T23:59:59Z`);
      const { data: guruData } = await supabase.from('guru').select('nip, nama_guru');

      let completedKBM = 0;
      const notYetTaught: any[] = [];
      const absentStudents: any[] = [];

      if (todaysSchedule) {
        const nipToName: Record<string, string> = {};
        if (guruData) guruData.forEach(g => { nipToName[g.nip] = g.nama_guru; });"""

if target_1 in content:
    content = content.replace(target_1, replacement_1)
else:
    print("Failed to fix guruData")

# Also check for actualName and actualNip
# Let's inspect where actualName and actualNip are
