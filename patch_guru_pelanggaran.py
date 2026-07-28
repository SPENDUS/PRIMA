import re

with open('src/pages/Pelanggaran.tsx', 'r') as f:
    content = f.read()

# Add import for supabase
if "import { supabase } from" not in content:
    content = content.replace(
        "import { ArrowLeft, Send, CheckCircle2 } from 'lucide-react';",
        "import { ArrowLeft, Send, CheckCircle2, ClipboardList, PlusCircle, Search } from 'lucide-react';\nimport { supabase } from '../lib/supabase';"
    )

# Add activeTab state
if "const [activeTab, setActiveTab] = useState('input');" not in content:
    content = content.replace(
        "const [showSuccess, setShowSuccess] = useState(false);",
        "const [showSuccess, setShowSuccess] = useState(false);\n  const [activeTab, setActiveTab] = useState('input');\n  const [rekapData, setRekapData] = useState<any[]>([]);\n  const [loadingRekap, setLoadingRekap] = useState(false);\n"
    )

# Add fetchRekap function
fetch_rekap = """
  useEffect(() => {
    if (activeTab === 'rekap') {
      fetchRekap();
    }
  }, [activeTab, kelas]);

  const fetchRekap = async () => {
    if (!kelas) return;
    setLoadingRekap(true);
    try {
      const { data: journalData, error } = await supabase
        .from('jurnal')
        .select('id, timestamp, catatan_mengajar, mata_pelajaran, nama_guru')
        .eq('kelas', kelas)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      const pelanggaranMap: Record<string, { nama: string, totalPoin: number, rincian: any[] }> = {};

      journalData?.forEach(j => {
        if (j.catatan_mengajar && j.catatan_mengajar !== 'Nihil' && j.catatan_mengajar !== '[]') {
          try {
            const parsed = typeof j.catatan_mengajar === 'string' ? JSON.parse(j.catatan_mengajar) : j.catatan_mengajar;
            if (Array.isArray(parsed)) {
              parsed.forEach((d: any) => {
                if (d.type && d.student) {
                  const match = d.type.match(/\\((\\d+)\\s+poin\\)/i);
                  let poin = match ? parseInt(match[1]) : 0;
                  
                  if (!pelanggaranMap[d.student]) {
                    pelanggaranMap[d.student] = { nama: d.student, totalPoin: 0, rincian: [] };
                  }
                  pelanggaranMap[d.student].totalPoin += poin;
                  pelanggaranMap[d.student].rincian.push({
                    date: new Date(j.timestamp).toLocaleDateString('id-ID'),
                    type: d.type,
                    poin: poin,
                    guru: j.nama_guru
                  });
                }
              });
            }
          } catch (e) {}
        }
      });

      setRekapData(Object.values(pelanggaranMap).sort((a: any, b: any) => b.totalPoin - a.totalPoin));
    } catch (e) {
      console.error("Error fetching rekap:", e);
    } finally {
      setLoadingRekap(false);
    }
  };
"""

if "const fetchRekap = async () => {" not in content:
    content = content.replace(
        "const uniqueKelas = Array.isArray(initialData?.murid) ? [...new Set(initialData.murid.map((m: any) => m.Kelas))].sort() : [];",
        "const uniqueKelas = Array.isArray(initialData?.murid) ? [...new Set(initialData.murid.map((m: any) => m.Kelas))].sort() : [];\n" + fetch_rekap
    )


# UI Update for tabs
tabs_ui = """
        <div className="flex gap-2 mb-6 p-1 bg-slate-200 dark:bg-slate-700/50 rounded-xl overflow-x-auto">
          <button
            onClick={() => setActiveTab('input')}
            className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === 'input' 
                ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 shadow-sm' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <PlusCircle className="w-5 h-5" />
            Input Pelanggaran
          </button>
          <button
            onClick={() => setActiveTab('rekap')}
            className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === 'rekap' 
                ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 shadow-sm' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            Rekapan Pelanggaran
          </button>
        </div>

        {activeTab === 'input' ? (
"""

if "activeTab === 'input'" not in content:
    content = content.replace(
        '<div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">',
        tabs_ui + '<div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">'
    )


rekap_ui = """
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Pilih Kelas</label>
              <select 
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 bg-slate-50 dark:bg-slate-700 dark:text-white"
              >
                <option value="">-- Pilih Kelas --</option>
                {uniqueKelas.map((k: any) => {
                  const val = String(k).toUpperCase().replace('KELAS', '').trim();
                  const label = String(k).toLowerCase().startsWith('kelas') ? k : `Kelas ${k}`;
                  return <option key={k} value={val}>{label}</option>;
                })}
              </select>
            </div>

            {!kelas ? (
               <div className="text-center p-8 text-slate-500">Pilih kelas terlebih dahulu untuk melihat rekapan pelanggaran.</div>
            ) : loadingRekap ? (
               <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div></div>
            ) : rekapData.length === 0 ? (
               <div className="text-center p-8 text-slate-500">Tidak ada data pelanggaran di kelas ini.</div>
            ) : (
               <div className="space-y-4">
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
               </div>
            )}
          </div>
        )}
"""

if "activeTab === 'input'" in content and rekap_ui not in content:
    content = content.replace(
        '</form>\n        </div>\n      </main>',
        '</form>\n        </div>\n' + rekap_ui + '\n      </main>'
    )


with open('src/pages/Pelanggaran.tsx', 'w') as f:
    f.write(content)

