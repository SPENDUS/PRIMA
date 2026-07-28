import re

with open('server.ts', 'r') as f:
    content = f.read()

# Add sync logic function before endpoints
sync_func = """
async function syncGuruJadwal() {
  try {
    const { data: jadwal } = await supabase.from('jadwal_real').select('*');
    const guruMap = new Map();
    jadwal?.forEach(j => {
        if (!guruMap.has(j.guru)) {
            guruMap.set(j.guru, { jp: 0, mapels: new Set() });
        }
        guruMap.get(j.guru).jp++;
        guruMap.get(j.guru).mapels.add(j.mapel);
    });
    
    for (const [nip, stats] of guruMap.entries()) {
        const mengajar = Array.from(stats.mapels).join(';');
        const target_jp = stats.jp;
        await supabase.from('guru').update({ mengajar, target_jp }).eq('nip', nip);
    }
  } catch(e) {
    console.error("Error syncing guru jadwal", e);
  }
}
"""

if "syncGuruJadwal" not in content:
    # insert before app.delete('/api/jadwal/:id'
    content = content.replace("  app.delete('/api/jadwal/:id',", sync_func + "\n  app.delete('/api/jadwal/:id',")

# Update endpoints to call syncGuruJadwal
delete_block = """    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: 'Jadwal berhasil dihapus' });
  });"""
new_delete_block = """    if (error) return res.status(500).json({ success: false, message: error.message });
    await syncGuruJadwal();
    res.json({ success: true, message: 'Jadwal berhasil dihapus' });
  });"""
content = content.replace(delete_block, new_delete_block)

put_block = """    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: 'Jadwal berhasil diupdate' });
  });"""
new_put_block = """    if (error) return res.status(500).json({ success: false, message: error.message });
    await syncGuruJadwal();
    res.json({ success: true, message: 'Jadwal berhasil diupdate' });
  });"""
content = content.replace(put_block, new_put_block)

post_block = """    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, message: 'Jadwal berhasil disimpan' });
  });"""
new_post_block = """    if (error) return res.status(500).json({ success: false, message: error.message });
    await syncGuruJadwal();
    res.json({ success: true, message: 'Jadwal berhasil disimpan' });
  });"""
content = content.replace(post_block, new_post_block)

# CSV Upload block
csv_block = """          await supabase.from('guru').upsert({
            nip: item.NIP,
            nama_guru: item.Nama_Guru,
            mengajar: item.Mengajar,
            password: item.Password || '123456',
            target_jp: item.Target_JP || 24
          });
        }
      }"""
new_csv_block = """          await supabase.from('guru').upsert({
            nip: item.NIP,
            nama_guru: item.Nama_Guru,
            mengajar: item.Mengajar,
            password: item.Password || '123456',
            target_jp: item.Target_JP || 24
          });
        }
        await syncGuruJadwal();
      }"""
content = content.replace(csv_block, new_csv_block)


with open('server.ts', 'w') as f:
    f.write(content)
