const fs = require('fs');
let code = fs.readFileSync('src/pages/Laporan.tsx', 'utf-8');

// 1. Add isTendik
if (!code.includes('const isTendik =')) {
    code = code.replace(
        'const schoolIdentity = useSchoolIdentity();',
        `const schoolIdentity = useSchoolIdentity();
  const isTendik = user?.role === 'tendik';
  const tendikJabatan = user?.Jabatan || 'Tenaga Administrasi Sekolah';`
    );
}

// 2. Change signature
const signatureTarget = `<p>Guru Mata Pelajaran,</p>`;
const signatureReplacement = `<p>{isTendik ? tendikJabatan : 'Guru Mata Pelajaran'},</p>`;
if (code.includes(signatureTarget)) {
    code = code.replace(signatureTarget, signatureReplacement);
}

// 3. Change headers
const theadTarget = `<th className="border border-slate-300 dark:border-slate-600 print:border-slate-300 p-2 print:p-1 text-center w-10 print:w-8">No</th>
                      <th className="border border-slate-300 dark:border-slate-600 print:border-slate-300 p-2 print:p-1 text-left w-32 print:w-24">Hari, Tanggal</th>
                      <th className="border border-slate-300 dark:border-slate-600 print:border-slate-300 p-2 print:p-1 text-center w-16 print:w-12">Kelas</th>
                      <th className="border border-slate-300 dark:border-slate-600 print:border-slate-300 p-2 print:p-1 text-left w-32 print:w-24">Mata Pelajaran</th>
                      <th className="border border-slate-300 dark:border-slate-600 print:border-slate-300 p-2 print:p-1 text-center w-16 print:w-12">Jam Ke</th>
                      <th className="border border-slate-300 dark:border-slate-600 print:border-slate-300 p-2 print:p-1 text-left min-w-[200px]">Materi/Kegiatan</th>
                      <th className="border border-slate-300 dark:border-slate-600 print:border-slate-300 p-2 print:p-1 text-left min-w-[150px]">Ketidakhadiran</th>`;
                      
const theadReplacement = `<th className="border border-slate-300 dark:border-slate-600 print:border-slate-300 p-2 print:p-1 text-center w-10 print:w-8">No</th>
                      <th className="border border-slate-300 dark:border-slate-600 print:border-slate-300 p-2 print:p-1 text-left w-32 print:w-24">Hari, Tanggal</th>
                      <th className="border border-slate-300 dark:border-slate-600 print:border-slate-300 p-2 print:p-1 text-center w-32 print:w-24">{isTendik ? 'Jabatan' : 'Kelas'}</th>
                      <th className="border border-slate-300 dark:border-slate-600 print:border-slate-300 p-2 print:p-1 text-left w-48 print:w-32">{isTendik ? 'Aktivitas Harian' : 'Mata Pelajaran'}</th>
                      {!isTendik && <th className="border border-slate-300 dark:border-slate-600 print:border-slate-300 p-2 print:p-1 text-center w-16 print:w-12">Jam Ke</th>}
                      {!isTendik && <th className="border border-slate-300 dark:border-slate-600 print:border-slate-300 p-2 print:p-1 text-left min-w-[200px]">Materi/Kegiatan</th>}
                      {!isTendik && <th className="border border-slate-300 dark:border-slate-600 print:border-slate-300 p-2 print:p-1 text-left min-w-[150px]">Ketidakhadiran</th>}`;

if (code.includes(theadTarget)) {
    code = code.replace(theadTarget, theadReplacement);
}

// 4. Change empty state colSpan
const emptyStateTarget = `<td colSpan={7} className="border border-slate-300 dark:border-slate-600 print:border-slate-300 p-6 text-center text-slate-500 dark:text-slate-400 italic">Tidak ada data jurnal.</td>`;
const emptyStateReplacement = `<td colSpan={isTendik ? 4 : 7} className="border border-slate-300 dark:border-slate-600 print:border-slate-300 p-6 text-center text-slate-500 dark:text-slate-400 italic">Tidak ada data jurnal.</td>`;

if (code.includes(emptyStateTarget)) {
    code = code.replace(emptyStateTarget, emptyStateReplacement);
}

// 5. Change row cells
const trTarget = `<tr key={\`\${idx}-\${i}\`} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 print:hover:bg-transparent break-inside-avoid">
                                  {i === 0 && (
                                    <>
                                      <td rowSpan={parsedMateri.length} className="border border-slate-300 dark:border-slate-600 print:border-slate-300 p-2 print:p-1 text-center align-top">{idx + 1}</td>
                                      <td rowSpan={parsedMateri.length} className="border border-slate-300 dark:border-slate-600 print:border-slate-300 p-2 print:p-1 align-top">
                                        {new Date(item.Timestamp).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                      </td>
                                      <td rowSpan={parsedMateri.length} className="border border-slate-300 dark:border-slate-600 print:border-slate-300 p-2 print:p-1 text-center font-bold align-top">{item.Kelas}</td>
                                    </>
                                  )}
                                  <td className="border border-slate-300 dark:border-slate-600 print:border-slate-300 p-2 print:p-1 align-top break-words">{m.mataPelajaran}</td>
                                  <td className="border border-slate-300 dark:border-slate-600 print:border-slate-300 p-2 print:p-1 text-center align-top">{jamText}</td>
                                  <td className="border border-slate-300 dark:border-slate-600 print:border-slate-300 p-2 print:p-1 align-top break-words whitespace-pre-wrap">{m.materi}</td>
                                  {i === 0 && (
                                    <td rowSpan={parsedMateri.length} className="border border-slate-300 dark:border-slate-600 print:border-slate-300 p-2 print:p-1 text-slate-600 dark:text-slate-300 print:text-slate-600 align-top break-words">
                                      {(() => {
                                        if (!item.Ketidakhadiran || item.Ketidakhadiran === '[]' || item.Ketidakhadiran === 'Nihil') return 'Nihil';
                                        try {
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
                                        }
                                        return item.Ketidakhadiran;
                                      })()}
                                    </td>
                                  )}
                                </tr>`;

const trReplacement = `<tr key={\`\${idx}-\${i}\`} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 print:hover:bg-transparent break-inside-avoid">
                                  {i === 0 && (
                                    <>
                                      <td rowSpan={parsedMateri.length} className="border border-slate-300 dark:border-slate-600 print:border-slate-300 p-2 print:p-1 text-center align-top">{idx + 1}</td>
                                      <td rowSpan={parsedMateri.length} className="border border-slate-300 dark:border-slate-600 print:border-slate-300 p-2 print:p-1 align-top">
                                        {new Date(item.Timestamp).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                      </td>
                                      <td rowSpan={parsedMateri.length} className="border border-slate-300 dark:border-slate-600 print:border-slate-300 p-2 print:p-1 text-center font-bold align-top">{isTendik ? tendikJabatan : item.Kelas}</td>
                                    </>
                                  )}
                                  <td className="border border-slate-300 dark:border-slate-600 print:border-slate-300 p-2 print:p-1 align-top break-words whitespace-pre-wrap">{isTendik ? m.materi : m.mataPelajaran}</td>
                                  {!isTendik && <td className="border border-slate-300 dark:border-slate-600 print:border-slate-300 p-2 print:p-1 text-center align-top">{jamText}</td>}
                                  {!isTendik && <td className="border border-slate-300 dark:border-slate-600 print:border-slate-300 p-2 print:p-1 align-top break-words whitespace-pre-wrap">{m.materi}</td>}
                                  {!isTendik && i === 0 && (
                                    <td rowSpan={parsedMateri.length} className="border border-slate-300 dark:border-slate-600 print:border-slate-300 p-2 print:p-1 text-slate-600 dark:text-slate-300 print:text-slate-600 align-top break-words">
                                      {(() => {
                                        if (!item.Ketidakhadiran || item.Ketidakhadiran === '[]' || item.Ketidakhadiran === 'Nihil') return 'Nihil';
                                        try {
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
                                        }
                                        return item.Ketidakhadiran;
                                      })()}
                                    </td>
                                  )}
                                </tr>`;

if (code.includes(trTarget)) {
    code = code.replace(trTarget, trReplacement);
} else {
    console.log("trTarget NOT FOUND");
}

fs.writeFileSync('src/pages/Laporan.tsx', code);
console.log("Patched Laporan.tsx");
