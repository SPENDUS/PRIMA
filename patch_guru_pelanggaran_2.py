import re

with open('src/pages/Pelanggaran.tsx', 'r') as f:
    content = f.read()

old_query = """      const { data: journalData, error } = await supabase
        .from('jurnal')
        .select('id, timestamp, catatan_mengajar, mata_pelajaran, nama_guru')
        .eq('kelas', kelas)
        .order('timestamp', { ascending: false });"""

new_query = """      const { data: journalData, error } = await supabase
        .from('jurnal')
        .select('id, timestamp, catatan_mengajar, mata_pelajaran, nama_guru')
        .or(`kelas.eq."${kelas}",kelas.eq."Kelas ${kelas}"`)
        .order('timestamp', { ascending: false });"""

if old_query in content:
    content = content.replace(old_query, new_query)
else:
    print("Old query not found")

with open('src/pages/Pelanggaran.tsx', 'w') as f:
    f.write(content)
