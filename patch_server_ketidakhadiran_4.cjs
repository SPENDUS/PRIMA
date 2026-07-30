const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const target = `          // Ketidakhadiran
          try {
            const absen = typeof j.ketidakhadiran === 'string' ? JSON.parse(j.ketidakhadiran) : j.ketidakhadiran;
            if (Array.isArray(absen)) {
              totalKetidakhadiran += absen.length;
              absen.forEach(a => {
                detailKetidakhadiran.push({
                  nama: a.nama || a,
                  kelas: jCls,
                  guru: j.nama_guru,
                  mapel: j.pembelajaran
                });
              });
            }
          } catch (e) {}`;

const replacement = `          // Ketidakhadiran
          try {
            const absen = typeof j.ketidakhadiran === 'string' ? JSON.parse(j.ketidakhadiran) : j.ketidakhadiran;
            if (Array.isArray(absen)) {
              absen.forEach(a => {
                if (a.students && Array.isArray(a.students)) {
                  totalKetidakhadiran += a.students.length;
                  a.students.forEach((sName: string) => {
                    detailKetidakhadiran.push({
                      nama: sName,
                      kelas: jCls,
                      guru: j.nama_guru,
                      mapel: j.mata_pelajaran || j.pembelajaran,
                      keterangan: a.type
                    });
                  });
                } else if (a.nama || a.namaLengkap) {
                  totalKetidakhadiran += 1;
                  detailKetidakhadiran.push({
                    nama: a.nama || a.namaLengkap,
                    kelas: jCls,
                    guru: j.nama_guru,
                    mapel: j.mata_pelajaran || j.pembelajaran,
                    keterangan: a.keterangan || a.ket || 'Tidak Hadir'
                  });
                } else if (typeof a === 'string') {
                  totalKetidakhadiran += 1;
                  detailKetidakhadiran.push({
                    nama: a,
                    kelas: jCls,
                    guru: j.nama_guru,
                    mapel: j.mata_pelajaran || j.pembelajaran,
                    keterangan: 'Tidak Hadir'
                  });
                }
              });
            }
          } catch (e) {}`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('server.ts', code);
    console.log("Patched server.ts monitoring dash stats");
}
