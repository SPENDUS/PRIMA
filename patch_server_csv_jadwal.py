import re

with open('server.ts', 'r') as f:
    content = f.read()

jadwal_csv_block = """          const { error } = await supabase.from('jadwal_real').insert(jadwalToInsert);
          if (error) throw error;
        }
      }"""
new_jadwal_csv_block = """          const { error } = await supabase.from('jadwal_real').insert(jadwalToInsert);
          if (error) throw error;
        }
        await syncGuruJadwal();
      }"""
content = content.replace(jadwal_csv_block, new_jadwal_csv_block)

with open('server.ts', 'w') as f:
    f.write(content)
