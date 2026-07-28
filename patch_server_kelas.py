import re

with open('server.ts', 'r') as f:
    content = f.read()

target = """  app.get('/api/murid', async (req, res) => {"""
replacement = """  app.get('/api/kelas', async (req, res) => {
    try {
      const { data, error } = await supabase.from('murid').select('"Kelas"');
      if (error) throw error;
      const uniqueKelas = Array.from(new Set(data.map((m: any) => m.Kelas))).filter(Boolean) as string[];
      uniqueKelas.sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
      res.json({ success: true, data: uniqueKelas });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  app.get('/api/murid', async (req, res) => {"""

if target in content:
    content = content.replace(target, replacement)
    with open('server.ts', 'w') as f:
        f.write(content)
    print("Added /api/kelas")
else:
    print("Failed to add /api/kelas")
