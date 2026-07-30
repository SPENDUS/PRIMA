const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const target = `            if (Array.isArray(absenList)) {
              absenList.forEach((absenGroup: any) => {
                const type = absenGroup.type || 'Tidak Hadir';
                const students = absenGroup.students || [];
                students.forEach((studentName: string) => {
                  // Avoid duplicates for the same student on the same day
                  const dateStr = new Date(j.timestamp).toISOString().split('T')[0];
                  if (!absentStudents.some(s => s.nama === studentName && s.kelas === j.kelas && s.tanggal === dateStr)) {
                    absentStudents.push({
                      tanggal: dateStr,
                      nama: studentName,
                      kelas: j.kelas,
                      keterangan: type
                    });
                  }
                });
              });
            }`;

const replacement = `            if (Array.isArray(absenList)) {
              absenList.forEach((absenGroup: any) => {
                const dateStr = new Date(j.timestamp).toISOString().split('T')[0];
                if (absenGroup.students && Array.isArray(absenGroup.students)) {
                  absenGroup.students.forEach((studentName: string) => {
                    if (!absentStudents.some(s => s.nama === studentName && s.kelas === j.kelas && s.tanggal === dateStr)) {
                      absentStudents.push({
                        tanggal: dateStr,
                        nama: studentName,
                        kelas: j.kelas,
                        keterangan: absenGroup.type || 'Tidak Hadir'
                      });
                    }
                  });
                } else if (absenGroup.nama || absenGroup.namaLengkap) {
                  const studentName = absenGroup.nama || absenGroup.namaLengkap;
                  if (!absentStudents.some(s => s.nama === studentName && s.kelas === j.kelas && s.tanggal === dateStr)) {
                    absentStudents.push({
                      tanggal: dateStr,
                      nama: studentName,
                      kelas: j.kelas,
                      keterangan: absenGroup.keterangan || absenGroup.ket || 'Tidak Hadir'
                    });
                  }
                }
              });
            }`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('server.ts', code);
    console.log("Patched server.ts monitoring ketidakhadiran");
}
