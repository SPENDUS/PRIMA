import re

with open('server.ts', 'r') as f:
    content = f.read()

# Fix Admin main-stats for `completedKBM` logic where `todaysJurnal` is matched with `todaysSchedule`
target = """        todaysSchedule.forEach(schedule => {
          const isDone = todaysJurnal?.some(jurnal => {
            return jurnal.nama_guru === schedule.guru && jurnal.kelas === schedule.kelas;
          });"""
replacement = """        const nipToName: Record<string, string> = {};
        if (guruData) guruData.forEach(g => { nipToName[g.nip] = g.nama_guru; });
        todaysSchedule.forEach(schedule => {
          const guruName = nipToName[schedule.guru] || schedule.guru;
          const isDone = todaysJurnal?.some(jurnal => {
            return jurnal.nama_guru === guruName && jurnal.kelas === schedule.kelas;
          });"""

if target in content:
    content = content.replace(target, replacement)
    
with open('server.ts', 'w') as f:
    f.write(content)
