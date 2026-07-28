import re

with open('server.ts', 'r') as f:
    content = f.read()

target = """    const { data: todaysJurnal } = await supabase.from('jurnal').select('*').gte('timestamp', `${todayDateStr}T00:00:00Z`).lte('timestamp', `${todayDateStr}T23:59:59Z`);

    const dataByClass: any = {};
    if (scheduleList) {
      scheduleList.forEach(item => {
        const matchedJurnal = todaysJurnal?.find(j => {
          if (j.kelas !== item.kelas || j.nama_guru !== item.guru) return false;"""

replacement = """    const { data: todaysJurnal } = await supabase.from('jurnal').select('*').gte('timestamp', `${todayDateStr}T00:00:00Z`).lte('timestamp', `${todayDateStr}T23:59:59Z`);
    const { data: guruList } = await supabase.from('guru').select('nip, nama_guru');
    
    const nipToName: Record<string, string> = {};
    if (guruList) {
       guruList.forEach(g => { nipToName[g.nip] = g.nama_guru; });
    }

    const dataByClass: any = {};
    if (scheduleList) {
      scheduleList.forEach(item => {
        const guruName = nipToName[item.guru] || item.guru;
        const matchedJurnal = todaysJurnal?.find(j => {
          if (j.kelas !== item.kelas || j.nama_guru !== guruName) return false;"""

content = content.replace(target, replacement)

# Fix Admin Keterlaksanaan API similarly
target2 = """            const isDone = todaysJurnal?.some(j => {
              const jCls = String(j.kelas).replace(/\D/g, '');
              return jCls === cls && j.nama_guru === sch.guru;
            });"""
replacement2 = """            const guruName = nipToName[sch.guru] || sch.guru;
            const isDone = todaysJurnal?.some(j => {
              const jCls = String(j.kelas).replace(/\D/g, '');
              return jCls === cls && j.nama_guru === guruName;
            });"""
if target2 in content:
    content = content.replace(target2, replacement2)
    
target3 = """        todaysSchedule.forEach(sch => {
          const isDone = todaysJurnal?.some(j => j.kelas === sch.kelas && j.nama_guru === sch.guru);
          if (!isDone) {"""
replacement3 = """        todaysSchedule.forEach(sch => {
          const guruName = nipToName[sch.guru] || sch.guru;
          const isDone = todaysJurnal?.some(j => j.kelas === sch.kelas && j.nama_guru === guruName);
          if (!isDone) {"""
if target3 in content:
    content = content.replace(target3, replacement3)

with open('server.ts', 'w') as f:
    f.write(content)
