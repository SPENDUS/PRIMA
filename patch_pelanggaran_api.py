import re

with open('server.ts', 'r') as f:
    content = f.read()

api_code = """
  // --- PELANGGARAN ENDPOINTS ---
  app.delete('/api/pelanggaran/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { error } = await supabase.from('jurnal').delete().eq('id', id);
      if (error) throw error;
      res.json({ success: true, message: 'Berhasil dihapus' });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  app.put('/api/pelanggaran/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { type, penanganan } = req.body;
      
      // Get existing
      const { data, error: fetchErr } = await supabase.from('jurnal').select('catatan_mengajar').eq('id', id).single();
      if (fetchErr) throw fetchErr;

      let catatan = [];
      if (data && data.catatan_mengajar) {
        try {
          catatan = JSON.parse(data.catatan_mengajar);
          if (Array.isArray(catatan) && catatan.length > 0) {
            catatan[0].type = type;
            catatan[0].penanganan = penanganan;
          }
        } catch (e) {}
      }

      const { error } = await supabase.from('jurnal').update({
        catatan_mengajar: JSON.stringify(catatan)
      }).eq('id', id);

      if (error) throw error;
      res.json({ success: true, message: 'Berhasil diupdate' });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  });
"""

if "// --- PELANGGARAN ENDPOINTS ---" not in content:
    # Insert after "// --- JURNAL ENDPOINTS ---" or similar
    if "app.post('/api/jurnal', async (req, res) => {" in content:
        content = content.replace("app.post('/api/jurnal', async (req, res) => {", api_code + "\n  app.post('/api/jurnal', async (req, res) => {")
        with open('server.ts', 'w') as f:
            f.write(content)
        print("API patched successfully")
    else:
        print("Could not find insertion point")
else:
    print("API already patched")
