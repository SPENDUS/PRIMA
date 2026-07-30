const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const target = `            absents.forEach((record: any) => {
              if (!alreadyCounted && record.students && record.students.includes(studentName) && !processedPresensiDates.has(date)) {
                if (!studentDailyStatus[date]) studentDailyStatus[date] = new Set();
                studentAbsentJP[date] = (studentAbsentJP[date] || 0) + jpCount;

                let status = record.type || 'Alpa'; // Default to Alpa if type is missing
                if (status === 'Sakit') { sakitJP += jpCount; studentDailyStatus[date].add('S'); }
                else if (status === 'Izin') { izinJP += jpCount; studentDailyStatus[date].add('I'); }
                else if (status === 'Alpa' || status === 'Tidak Hadir' || status === 'A') { alphaJP += jpCount; studentDailyStatus[date].add('A'); }
                else if (status === 'Dispensasi') { studentDailyStatus[date].add('D'); }
                alreadyCounted = true;
              }
            });`;

const replacement = `            absents.forEach((record: any) => {
              const matchesStudent = (record.students && record.students.includes(studentName)) || 
                                     (record.nama === studentName || record.namaLengkap === studentName);

              if (!alreadyCounted && matchesStudent && !processedPresensiDates.has(date)) {
                if (!studentDailyStatus[date]) studentDailyStatus[date] = new Set();
                studentAbsentJP[date] = (studentAbsentJP[date] || 0) + jpCount;

                let status = record.type || record.keterangan || record.ket || 'Alpa'; 
                if (status.includes('Sakit') || status === 'S' || status === 'sakit') { sakitJP += jpCount; studentDailyStatus[date].add('S'); }
                else if (status.includes('Izin') || status === 'I' || status === 'izin') { izinJP += jpCount; studentDailyStatus[date].add('I'); }
                else if (status.includes('Alpa') || status.includes('Tidak Hadir') || status === 'A' || status === 'alpa') { alphaJP += jpCount; studentDailyStatus[date].add('A'); }
                else if (status.includes('Dispensasi') || status === 'dispensasi') { studentDailyStatus[date].add('D'); }
                alreadyCounted = true;
              }
            });`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('server.ts', code);
    console.log("Patched server.ts absents tracking");
} else {
    console.log("Target not found 5");
}
