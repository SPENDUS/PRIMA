import re

with open('server.ts', 'r') as f:
    content = f.read()

old_code = """  app.get('/api/jadwal', async (req, res) => {
    let { kelas, hari, guru } = req.query;
    let query = supabase.from('jadwal_real').select('*').order('jam');
    
    if (kelas) {
      const normalizedKelas = String(kelas).toUpperCase().replace('KELAS', '').trim();
      query = query.eq('kelas', normalizedKelas);
    }
    if (hari) query = query.eq('hari', hari);
    if (guru) query = query.eq('guru', guru);
    
    const { data, error } = await query;
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, data });
  });"""

new_code = """  app.get('/api/jadwal', async (req, res) => {
    let { kelas, hari, guru } = req.query;
    let query = supabase.from('jadwal_real').select('*').order('jam');
    
    if (kelas) {
      const normalizedKelas = String(kelas).toUpperCase().replace('KELAS', '').trim();
      query = query.eq('kelas', normalizedKelas);
    }
    if (hari) query = query.eq('hari', hari);
    if (guru) query = query.eq('guru', guru);
    
    const { data, error } = await query;
    if (error) return res.status(500).json({ success: false, message: error.message });

    // Map nip to name
    const { data: guruData } = await supabase.from('guru').select('nip, nama_guru');
    const nipToName: Record<string, string> = {};
    if (guruData) {
      guruData.forEach(g => { nipToName[g.nip] = g.nama_guru; });
    }

    const mappedData = data?.map(item => ({
      ...item,
      guru: nipToName[item.guru] || item.guru
    })) || [];

    res.json({ success: true, data: mappedData });
  });"""

if old_code in content:
    content = content.replace(old_code, new_code)
    with open('server.ts', 'w') as f:
        f.write(content)
    print("API jadwal guru patched")
else:
    print("API jadwal guru old code not found")
