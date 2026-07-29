import re

with open('server.ts', 'r') as f:
    content = f.read()

old_code = """  app.get('/api/jadwal', async (req, res) => {
    const { kelas, hari, guru } = req.query;
    let query = supabase.from('jadwal_real').select('*').order('jam');
    
    if (kelas) query = query.eq('kelas', kelas);"""

new_code = """  app.get('/api/jadwal', async (req, res) => {
    let { kelas, hari, guru } = req.query;
    let query = supabase.from('jadwal_real').select('*').order('jam');
    
    if (kelas) {
      const normalizedKelas = String(kelas).toUpperCase().replace('KELAS', '').trim();
      query = query.eq('kelas', normalizedKelas);
    }"""

if old_code in content:
    content = content.replace(old_code, new_code)
    with open('server.ts', 'w') as f:
        f.write(content)
    print("API jadwal patched")
else:
    print("API jadwal old code not found")
