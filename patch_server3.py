import re

with open('server.ts', 'r') as f:
    content = f.read()

old_query = "let query = supabase.from('jurnal').select('id, timestamp, ketidakhadiran, catatan_mengajar, mata_pelajaran, jam_pembelajaran, nama_guru').eq('kelas', studentClass).order('timestamp', { ascending: false });"
new_query = """
      const normalizedClass = studentClass ? String(studentClass).toUpperCase().replace('KELAS', '').trim() : '';
      let query = supabase.from('jurnal').select('id, timestamp, ketidakhadiran, catatan_mengajar, mata_pelajaran, jam_pembelajaran, nama_guru')
        .or(`kelas.eq."${studentClass}",kelas.eq."${normalizedClass}"`)
        .order('timestamp', { ascending: false });
"""

if old_query in content:
    content = content.replace(old_query, new_query.strip())
else:
    print("WARNING: Could not find old query")

with open('server.ts', 'w') as f:
    f.write(content)
