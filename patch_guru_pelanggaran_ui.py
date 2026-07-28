import re

with open('src/pages/Pelanggaran.tsx', 'r') as f:
    content = f.read()

# Update fetchRekap
old_push = """                  pelanggaranMap[d.student].rincian.push({
                    date: new Date(j.timestamp).toLocaleDateString('id-ID'),
                    type: d.type,
                    poin: poin,
                    guru: j.nama_guru
                  });"""

new_push = """                  pelanggaranMap[d.student].rincian.push({
                    date: new Date(j.timestamp).toLocaleDateString('id-ID'),
                    type: d.type,
                    poin: poin,
                    guru: j.nama_guru,
                    penanganan: d.penanganan || null
                  });"""

content = content.replace(old_push, new_push)

# Update UI
old_ui = """               <div className="space-y-4">
                  {rekapData.map((item, idx) => (
                     <div key={idx} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-3">
                           <h4 className="font-bold text-lg text-slate-800 dark:text-white">{item.nama}</h4>
                           <div className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 font-bold px-3 py-1 rounded-lg">
                             Total: {item.totalPoin} Poin
                           </div>
                        </div>
                        <ul className="space-y-2">
                           {item.rincian.map((r: any, rIdx: number) => (
                              <li key={rIdx} className="text-sm flex flex-col md:flex-row md:items-start gap-1 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                 <span className="text-slate-500 min-w-[100px]">{r.date}</span>
                                 <span className="text-slate-700 dark:text-slate-300 flex-1">{r.type}</span>
                                 <span className="text-xs text-slate-500">Pelapor: {r.guru}</span>
                              </li>
                           ))}
                        </ul>
                     </div>
                  ))}
               </div>"""

new_ui = """               <div className="space-y-6">
                  {rekapData.map((item, idx) => (
                     <div key={idx} className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
                        <div className="flex justify-between items-center p-6 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
                           <h4 className="font-bold text-lg text-slate-800 dark:text-white">{item.nama}</h4>
                           <div className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 font-bold px-4 py-2 rounded-lg">
                             Total: {item.totalPoin} Poin
                           </div>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300">
                              <tr>
                                <th className="px-6 py-4 font-semibold">Tanggal</th>
                                <th className="px-6 py-4 font-semibold">Pelanggaran</th>
                                <th className="px-6 py-4 font-semibold">Poin</th>
                                <th className="px-6 py-4 font-semibold">Guru Pelapor</th>
                                <th className="px-6 py-4 font-semibold">Status Penanganan</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-800">
                              {item.rincian.map((r: any, rIdx: number) => (
                                <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                  <td className="px-6 py-4 whitespace-nowrap">{r.date}</td>
                                  <td className="px-6 py-4 max-w-xs">{r.type}</td>
                                  <td className="px-6 py-4 font-bold text-red-600">{r.poin}</td>
                                  <td className="px-6 py-4 whitespace-nowrap">{r.guru}</td>
                                  <td className="px-6 py-4">
                                     {r.penanganan ? (
                                       <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium border border-green-200">Ditangani</span>
                                     ) : (
                                       <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-medium border border-yellow-200">Belum</span>
                                     )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                     </div>
                  ))}
               </div>"""

if old_ui in content:
    content = content.replace(old_ui, new_ui)
else:
    print("WARNING: Could not find old UI")

with open('src/pages/Pelanggaran.tsx', 'w') as f:
    f.write(content)

