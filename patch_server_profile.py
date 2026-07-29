import re

with open('server.ts', 'r') as f:
    content = f.read()

api_code = """
  app.put('/api/profile', async (req, res) => {
    const { role, oldNip, newNip, newNama, newPassword } = req.body;
    try {
      let table = '';
      let nipCol = '';
      let nameCol = '';

      if (role === 'guru') {
        table = 'guru';
        nipCol = 'nip';
        nameCol = 'nama_guru';
      } else if (role === 'tendik') {
        table = 'tendik';
        nipCol = 'nip';
        nameCol = 'nama_tendik';
      } else {
        return res.status(400).json({ success: false, message: 'Role tidak didukung untuk edit data' });
      }

      const updates: any = {};
      if (newNip) updates[nipCol] = newNip;
      if (newNama) updates[nameCol] = newNama;
      if (newPassword) updates['password'] = newPassword;

      if (Object.keys(updates).length === 0) {
        return res.json({ success: true, message: 'Tidak ada data yang diubah' });
      }

      const { error } = await supabase.from(table).update(updates).eq(nipCol, oldNip);
      
      if (error) throw error;
      res.json({ success: true, message: 'Data berhasil diperbarui', updates });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  });
"""

if "app.put('/api/profile'" not in content:
    content = content.replace("  app.post('/api/login', async (req, res) => {", api_code + "\n  app.post('/api/login', async (req, res) => {")
    with open('server.ts', 'w') as f:
        f.write(content)
    print("API patched successfully")
else:
    print("API already patched")
