import re

with open('server.ts', 'r') as f:
    content = f.read()

# First replace the nipToName definition inside /api/monitoring
target_nip = """      // Fetch all schedules to calculate total JP for today
      const { data: allTodaySchedules } = await supabase.from('jadwal_real').select('jam').eq('hari', hariIniIndo);
      const totalJP = allTodaySchedules?.length || 0;

      const monitoringData: any[] = [];"""

replacement_nip = """      // Fetch all schedules to calculate total JP for today
      const { data: allTodaySchedules } = await supabase.from('jadwal_real').select('jam').eq('hari', hariIniIndo);
      const totalJP = allTodaySchedules?.length || 0;
      
      const { data: guruData } = await supabase.from('guru').select('nip, nama_guru');
      const nipToName: Record<string, string> = {};
      if (guruData) guruData.forEach(g => { nipToName[g.nip] = g.nama_guru; });

      const monitoringData: any[] = [];"""

if target_nip in content:
    content = content.replace(target_nip, replacement_nip)
else:
    print("Failed to inject nipToName")

# Next replace class normalization logic in /api/monitoring
content = content.replace("String(m.Kelas).replace(/\\D/g, '')", "String(m.Kelas).toUpperCase().replace('KELAS', '').trim()")
content = content.replace("String(s.kelas).replace(/\\D/g, '')", "String(s.kelas).toUpperCase().replace('KELAS', '').trim()")
content = content.replace("String(j.kelas).replace(/\\D/g, '')", "String(j.kelas).toUpperCase().replace('KELAS', '').trim()")

# And fix where guru is returned in monitoring data
target_data = """            monitoringData.push({
              kelas: cls, // Use normalized class
              status: isDone,
              guru: sch.guru,
              mapel: sch.mapel,
              jam: String(sch.jam)
            });"""
replacement_data = """            monitoringData.push({
              kelas: cls, // Use normalized class
              status: isDone,
              guru: guruName,
              mapel: sch.mapel,
              jam: String(sch.jam)
            });"""

if target_data in content:
    content = content.replace(target_data, replacement_data)
else:
    print("Failed to inject guruName to monitoringData")
    
# also fix belumMengisi to use guruName
target_belum = """          if (!isDone) {
            belumMengisi.push({
              kelas: cls,
              guru: sch.guru,
              mapel: sch.mapel,
              jam: sch.jam
            });
          }"""
replacement_belum = """          if (!isDone) {
            belumMengisi.push({
              kelas: cls,
              guru: guruName,
              mapel: sch.mapel,
              jam: sch.jam
            });
          }"""
if target_belum in content:
    content = content.replace(target_belum, replacement_belum)

with open('server.ts', 'w') as f:
    f.write(content)

