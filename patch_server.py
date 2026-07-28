with open('server.ts', 'r') as f:
    content = f.read()

content = content.replace(
    "let query = supabase.from('jurnal').select('id, timestamp, ketidakhadiran, mata_pelajaran, jam_pembelajaran').eq('kelas', studentClass).order('timestamp', { ascending: false });",
    "let query = supabase.from('jurnal').select('id, timestamp, ketidakhadiran, catatan_mengajar, mata_pelajaran, jam_pembelajaran, nama_guru').eq('kelas', studentClass).order('timestamp', { ascending: false });"
)

with open('server.ts', 'w') as f:
    f.write(content)

