import re

with open('src/pages/StudentDashboard.tsx', 'r') as f:
    content = f.read()

# Update the call to Pelanggaran
content = content.replace(
    "{currentPage === 'pelanggaran' && <Pelanggaran onBack={() => setCurrentPage('main')} />}",
    "{currentPage === 'pelanggaran' && <Pelanggaran user={user} onBack={() => setCurrentPage('main')} />}"
)

# Replace the component
old_pelanggaran = """function Pelanggaran({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          <X className="w-6 h-6 text-slate-500" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Catatan Kedisiplinan</h2>
          <p className="text-slate-500 dark:text-slate-400">Rekap pelanggaran tata tertib</p>
        </div>
      </header>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Tidak Ada Pelanggaran</h3>
        <p className="text-slate-500 dark:text-slate-400">Hebat! Pertahankan sikap disiplinmu di sekolah.</p>
      </div>
    </div>
  );
}"""

new_pelanggaran = """function Pelanggaran({ user, onBack }: { user: any, onBack: () => void }) {
  const [data, setData] = useState<any[]>([]);
  const [totalPoin, setTotalPoin] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const nisn = user?.NISN || user?.NIS || user?.id;
      if (!nisn) return;
      try {
        const res = await fetch(`/api/siswa/kehadiran?nisn=${nisn}`);
        const result = await res.json();
        if (result.success) {
          setData(result.pelanggaran || []);
          setTotalPoin(result.totalPoinPelanggaran || 0);
        }
      } catch (e) {
        console.error("Failed to fetch pelanggaran", e);
      } finally {
        setLoading(false);
      }
    };
    if (user?.NISN || user?.NIS || user?.id) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          <X className="w-6 h-6 text-slate-500" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Catatan Kedisiplinan</h2>
          <p className="text-slate-500 dark:text-slate-400">Rekap pelanggaran tata tertib</p>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 dark:border-white"></div></div>
      ) : data.length > 0 ? (
        <div className="space-y-6">
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
             <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center text-red-600 dark:text-red-400">
                   <AlertTriangle className="w-8 h-8" />
                </div>
                <div>
                   <h3 className="text-lg font-bold text-slate-800 dark:text-white">Total Poin Pelanggaran</h3>
                   <p className="text-slate-600 dark:text-slate-300">Perhatikan kedisiplinan dan hindari mengulangi kesalahan.</p>
                </div>
             </div>
             <div className="text-4xl font-black text-red-600 dark:text-red-400">{totalPoin} Poin</div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
               <h3 className="font-bold text-slate-800 dark:text-white">Rincian Pelanggaran</h3>
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
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {data.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">{item.date}</td>
                      <td className="px-6 py-4 max-w-xs">{item.type}</td>
                      <td className="px-6 py-4 font-bold text-red-600">{item.poin}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.guru}</td>
                      <td className="px-6 py-4">
                         {item.penanganan ? (
                           <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium">Ditangani</span>
                         ) : (
                           <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-medium">Belum</span>
                         )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Tidak Ada Pelanggaran</h3>
          <p className="text-slate-500 dark:text-slate-400">Hebat! Pertahankan sikap disiplinmu di sekolah.</p>
        </div>
      )}
    </div>
  );
}"""

if old_pelanggaran in content:
    content = content.replace(old_pelanggaran, new_pelanggaran)
else:
    print("WARNING: Could not find old Pelanggaran component exact match")

with open('src/pages/StudentDashboard.tsx', 'w') as f:
    f.write(content)

