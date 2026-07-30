const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const target = `            if (Array.isArray(absenList)) {
              absenList.forEach((absenGroup: any) => {
                const type = absenGroup.type || 'Tidak Hadir';
                const students = absenGroup.students || [];
                students.forEach((studentName: string) => {
                  if (!absentStudents.some(s => s.name === studentName && s.class === j.kelas)) {
                    absentStudents.push({
                      name: studentName,
                      class: j.kelas,
                      reason: type
                    });
                  }
                });
              });
            }`;

const replacement = `            if (Array.isArray(absenList)) {
              absenList.forEach((absenGroup: any) => {
                if (absenGroup.students && Array.isArray(absenGroup.students)) {
                  absenGroup.students.forEach((studentName: string) => {
                    if (!absentStudents.some(s => s.name === studentName && s.class === j.kelas)) {
                      absentStudents.push({
                        name: studentName,
                        class: j.kelas,
                        reason: absenGroup.type || 'Tidak Hadir'
                      });
                    }
                  });
                } else if (absenGroup.nama || absenGroup.namaLengkap) {
                  const studentName = absenGroup.nama || absenGroup.namaLengkap;
                  if (!absentStudents.some(s => s.name === studentName && s.class === j.kelas)) {
                    absentStudents.push({
                      name: studentName,
                      class: j.kelas,
                      reason: absenGroup.keterangan || absenGroup.ket || 'Tidak Hadir'
                    });
                  }
                }
              });
            }`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('server.ts', code);
    console.log("Patched server.ts monitoring dash ketidakhadiran");
}
