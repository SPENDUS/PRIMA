const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const targetStr = `  app.delete('/api/pelanggaran/:id', async (req, res) => {
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
  });`;

const replacementStr = `  app.delete('/api/pelanggaran/:id/item', async (req, res) => {
    try {
      const { id } = req.params;
      const { student, type } = req.body;
      const { data, error: fetchErr } = await supabase.from('jurnal').select('catatan_mengajar').eq('id', id).single();
      if (fetchErr) throw fetchErr;

      let catatan = [];
      if (data && data.catatan_mengajar && data.catatan_mengajar !== 'Nihil') {
        try {
          catatan = typeof data.catatan_mengajar === 'string' ? JSON.parse(data.catatan_mengajar) : data.catatan_mengajar;
          catatan = catatan.filter((c: any) => !(c.student === student && c.type === type));
        } catch (e) {}
      }

      const { error } = await supabase.from('jurnal').update({
        catatan_mengajar: JSON.stringify(catatan)
      }).eq('id', id);

      if (error) throw error;
      res.json({ success: true, message: 'Berhasil dihapus' });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  app.put('/api/pelanggaran/:id/item', async (req, res) => {
    try {
      const { id } = req.params;
      const { student, oldType, newType, penanganan } = req.body;
      
      const { data, error: fetchErr } = await supabase.from('jurnal').select('catatan_mengajar').eq('id', id).single();
      if (fetchErr) throw fetchErr;

      let catatan = [];
      if (data && data.catatan_mengajar && data.catatan_mengajar !== 'Nihil') {
        try {
          catatan = typeof data.catatan_mengajar === 'string' ? JSON.parse(data.catatan_mengajar) : data.catatan_mengajar;
          const targetIndex = catatan.findIndex((c: any) => c.student === student && c.type === oldType);
          if (targetIndex > -1) {
            if (newType) catatan[targetIndex].type = newType;
            if (penanganan !== undefined) catatan[targetIndex].penanganan = penanganan;
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
  });`;

if (code.includes(targetStr)) {
    code = code.replace(targetStr, replacementStr);
    fs.writeFileSync('server.ts', code);
    console.log("Patched server.ts pelanggaran endpoints");
} else {
    console.log("pelanggaran endpoints target not found");
}
