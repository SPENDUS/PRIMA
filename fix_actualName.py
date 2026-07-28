import re

with open('server.ts', 'r') as f:
    content = f.read()

target1 = """      if (namaGuru && nip) {
        query = query.or(`nama_guru.eq."${namaGuru}",nip.eq."${nip}"`);
      } else if (namaGuru) {
        query = query.eq('nama_guru', actualName);
      } else {
        query = query.eq('nip', nip);
      }"""
replacement1 = """      if (namaGuru && nip) {
        query = query.or(`nama_guru.eq."${namaGuru}",nip.eq."${nip}"`);
      } else if (namaGuru) {
        query = query.eq('nama_guru', namaGuru);
      } else {
        query = query.eq('nip', nip);
      }"""

if target1 in content:
    content = content.replace(target1, replacement1)

target2 = """        if (nip && namaGuru) {
          query = query.or(`nip.eq."${nip}",nama_guru.eq."${namaGuru}"`);
        } else if (nip) {
          query = query.eq('nip', nip);
        } else {
          query = query.eq('nama_guru', actualName);
        }"""
replacement2 = """        if (nip && namaGuru) {
          query = query.or(`nip.eq."${nip}",nama_guru.eq."${namaGuru}"`);
        } else if (nip) {
          query = query.eq('nip', nip);
        } else {
          query = query.eq('nama_guru', namaGuru);
        }"""
        
if target2 in content:
    content = content.replace(target2, replacement2)

target3 = """      const { data: mySchedules, error } = await supabase
        .from('jadwal_real')
        .select('*')
        .eq('guru', actualNip);"""
replacement3 = """      const { data: mySchedules, error } = await supabase
        .from('jadwal_real')
        .select('*')
        .eq('guru', nip || namaGuru);"""

if target3 in content:
    content = content.replace(target3, replacement3)

with open('server.ts', 'w') as f:
    f.write(content)

