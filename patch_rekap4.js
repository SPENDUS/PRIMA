const fs = require('fs');
let code = fs.readFileSync('src/pages/RekapAbsensi.tsx', 'utf-8');

const target1 = `const resultData = Object.values(studentMap).map(student => {
          totalSakit += student.s;
          totalIzin += student.i;
          totalAlpha += student.a;
          totalDispensasi += student.d;
          totalHadir += student.h;
          
          return {
            ...student,
            s_display: student.s > 0 ? student.s : '',
            i_display: student.i > 0 ? student.i : '',
            a_display: student.a > 0 ? student.a : '',
            d_display: student.d > 0 ? student.d : '',
            ket: (student.s === 0 && student.i === 0 && student.a === 0 && student.d === 0) ? (dateCount > 0 ? 'Hadir' : '') : ''
          };
        });`;

const replacement1 = `const resultData = Object.values(studentMap).map(student => {
          totalSakit += student.s;
          totalIzin += student.i;
          totalAlpha += student.a;
          totalDispensasi += student.d;
          totalHadir += student.h;
          
          return {
            ...student,
            s_display: student.s > 0 ? student.s : '',
            i_display: student.i > 0 ? student.i : '',
            a_display: student.a > 0 ? student.a : '',
            d_display: student.d > 0 ? student.d : '',
            ket: dateCount === 0 ? 'Belum ada data' : ((student.s === 0 && student.i === 0 && student.a === 0 && student.d === 0) ? 'Hadir' : '')
          };
        });`;

code = code.replace(target1, replacement1);

const target2 = `const totalStudentDays = resultData.length * (dateCount > 0 ? dateCount : 1);
        const hadirPercent = totalStudentDays > 0 ? Math.round((totalHadir / totalStudentDays) * 100) : 100;`;

const replacement2 = `const totalStudentDays = resultData.length * (dateCount > 0 ? dateCount : 1);
        const hadirPercent = dateCount === 0 ? 0 : (totalStudentDays > 0 ? Math.round((totalHadir / totalStudentDays) * 100) : 100);`;

code = code.replace(target2, replacement2);

fs.writeFileSync('src/pages/RekapAbsensi.tsx', code);
