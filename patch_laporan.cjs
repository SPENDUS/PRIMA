const fs = require('fs');
let code = fs.readFileSync('src/pages/Laporan.tsx', 'utf-8');

const filterTarget = `  const filteredData = jurnalData.filter(j => {
    if (filterBulan === 'semua' && filterTahun === 'semua') return true;
    const date = new Date(j.timestamp);
    const monthMatch = filterBulan === 'semua' || date.getMonth().toString() === filterBulan;
    const yearMatch = filterTahun === 'semua' || date.getFullYear().toString() === filterTahun;
    return monthMatch && yearMatch;
  });`;

const filterReplacement = `  const filteredData = jurnalData.filter(j => {
    if (filterBulan === 'semua' && filterTahun === 'semua') return true;
    const date = new Date(j.Timestamp || j.timestamp);
    const monthMatch = filterBulan === 'semua' || date.getMonth().toString() === filterBulan;
    const yearMatch = filterTahun === 'semua' || date.getFullYear().toString() === filterTahun;
    return monthMatch && yearMatch;
  });`;

if (code.includes(filterTarget)) {
    code = code.replace(filterTarget, filterReplacement);
    console.log("Patched filter");
}

const ketidakhadiranTarget = `                                        try {
                                          const parsedAbsen = JSON.parse(item.Ketidakhadiran);
                                          if (Array.isArray(parsedAbsen)) {
                                            return (
                                              <ul className="list-disc pl-4 space-y-1 print:pl-3">
                                                {parsedAbsen.map((a: any, i: number) => (
                                                  <li key={i}>
                                                    <span className="font-medium">{a.nama}</span> - {a.keterangan}
                                                  </li>
                                                ))}
                                              </ul>
                                            );
                                          }
                                        } catch (e) {
                                          // Fallback if not JSON
                                        }`;

const ketidakhadiranReplacement = `                                        try {
                                          const parsedAbsen = JSON.parse(item.Ketidakhadiran);
                                          if (Array.isArray(parsedAbsen)) {
                                            // Handle both legacy format [{nama, keterangan}] and new format [{type, students: []}]
                                            return (
                                              <ul className="list-disc pl-4 space-y-1 print:pl-3">
                                                {parsedAbsen.map((a: any, i: number) => {
                                                  if (a.students && Array.isArray(a.students)) {
                                                    return a.students.map((student: string, j: number) => (
                                                      <li key={\`\${i}-\${j}\`}>
                                                        <span className="font-medium">{student}</span> - {a.type}
                                                      </li>
                                                    ));
                                                  } else if (a.nama || a.namaLengkap) {
                                                    return (
                                                      <li key={i}>
                                                        <span className="font-medium">{a.nama || a.namaLengkap}</span> - {a.keterangan || a.ket}
                                                      </li>
                                                    );
                                                  }
                                                  return null;
                                                })}
                                              </ul>
                                            );
                                          }
                                        } catch (e) {
                                          // Fallback if not JSON
                                        }`;

if (code.includes(ketidakhadiranTarget)) {
    code = code.replace(ketidakhadiranTarget, ketidakhadiranReplacement);
    console.log("Patched ketidakhadiran");
}

fs.writeFileSync('src/pages/Laporan.tsx', code);
