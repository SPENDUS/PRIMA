const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const target = `            if (Array.isArray(parsed)) {
              parsed.forEach((absent: any) => {
                const key = \`\${absent.nama}-\${j.kelas}\`;
                if (!attendanceMap[key]) {
                  attendanceMap[key] = { nama: absent.nama, kelas: j.kelas, s: 0, i: 0, a: 0, total: 0 };
                }
                const ket = (absent.keterangan || '').toLowerCase();
                if (ket.includes('sakit') || ket === 's') attendanceMap[key].s++;
                else if (ket.includes('izin') || ket === 'i') attendanceMap[key].i++;
                else if (ket.includes('alpa') || ket.includes('alpha') || ket === 'a') attendanceMap[key].a++;
                
                attendanceMap[key].total = attendanceMap[key].s + attendanceMap[key].i + attendanceMap[key].a;
              });
            }`;

const replacement = `            if (Array.isArray(parsed)) {
              parsed.forEach((absent: any) => {
                if (absent.students && Array.isArray(absent.students)) {
                  absent.students.forEach((studentName: string) => {
                    const key = \`\${studentName}-\${j.kelas}\`;
                    if (!attendanceMap[key]) {
                      attendanceMap[key] = { nama: studentName, kelas: j.kelas, s: 0, i: 0, a: 0, total: 0 };
                    }
                    const ket = (absent.type || '').toLowerCase();
                    if (ket.includes('sakit') || ket === 's') attendanceMap[key].s++;
                    else if (ket.includes('izin') || ket === 'i') attendanceMap[key].i++;
                    else if (ket.includes('alpa') || ket.includes('alpha') || ket === 'a') attendanceMap[key].a++;
                    
                    attendanceMap[key].total = attendanceMap[key].s + attendanceMap[key].i + attendanceMap[key].a;
                  });
                } else if (absent.nama || absent.namaLengkap) {
                  const studentName = absent.nama || absent.namaLengkap;
                  const key = \`\${studentName}-\${j.kelas}\`;
                  if (!attendanceMap[key]) {
                    attendanceMap[key] = { nama: studentName, kelas: j.kelas, s: 0, i: 0, a: 0, total: 0 };
                  }
                  const ket = (absent.keterangan || absent.ket || '').toLowerCase();
                  if (ket.includes('sakit') || ket === 's') attendanceMap[key].s++;
                  else if (ket.includes('izin') || ket === 'i') attendanceMap[key].i++;
                  else if (ket.includes('alpa') || ket.includes('alpha') || ket === 'a') attendanceMap[key].a++;
                  
                  attendanceMap[key].total = attendanceMap[key].s + attendanceMap[key].i + attendanceMap[key].a;
                }
              });
            }`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('server.ts', code);
    console.log("Patched server.ts pelanggaran ketidakhadiran");
}
