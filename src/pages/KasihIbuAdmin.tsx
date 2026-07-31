import React, { useState, useEffect } from 'react';
import { Heart, Save, Star, Gift, Shield, Award, Trophy, Smile, Users, Medal, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { HABIT_POINTS } from '../utils/habitPoints';

export default function KasihIbuAdmin({ showToast }: { showToast: (msg: string, type?: 'success' | 'error') => void }) {
  const [pointPrice, setPointPrice] = useState<string>('100');
  const [featureName, setFeatureName] = useState<string>('Kasih Ibu');
  const [featureIcon, setFeatureIcon] = useState<string>('Heart');
  const [loading, setLoading] = useState(false);
  const [classStats, setClassStats] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [allStudentsRanking, setAllStudentsRanking] = useState<any[]>([]);
  const [selectedFilterClass, setSelectedFilterClass] = useState<string>('all');
  const [loadingTop10, setLoadingTop10] = useState(false);
  
  // For top 5 students modal
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [topStudents, setTopStudents] = useState<any[]>([]);
  const [loadingTop, setLoadingTop] = useState(false);

  const availableIcons = [
    { name: 'Heart', icon: Heart },
    { name: 'Star', icon: Star },
    { name: 'Gift', icon: Gift },
    { name: 'Shield', icon: Shield },
    { name: 'Award', icon: Award },
    { name: 'Trophy', icon: Trophy },
    { name: 'Smile', icon: Smile },
  ];

  useEffect(() => {
    fetchConfig();
    fetchStats();
    fetchTop10();
  }, []);

  const fetchTop10 = async () => {
    setLoadingTop10(true);
    try {
      const { data, error } = await supabase.from('kasih_ibu').select('nama_murid, kelas, nisn, validasi_walikelas, jenis_kebiasaan');
      if (data) {
        const studentCounts: Record<string, { nama: string, kelas: string, points: number, nisn: string }> = {};
        data.forEach(r => {
          const key = r.nisn || r.nama_murid;
          if (!studentCounts[key]) {
            studentCounts[key] = { nama: r.nama_murid, kelas: r.kelas || '-', points: 0, nisn: r.nisn };
          }
          let pts = 0;
          if (r.jenis_kebiasaan && r.jenis_kebiasaan.startsWith('Tukar Poin')) {
            const match = r.jenis_kebiasaan.match(/\(-(\d+)\)/);
            if (match) pts = -parseInt(match[1]);
          } else if (r.validasi_walikelas === 'Valid') {
            const matchedKey = Object.keys(HABIT_POINTS).find(k => k.toLowerCase() === r.jenis_kebiasaan?.toLowerCase());
            if (matchedKey) pts = HABIT_POINTS[matchedKey].points;
          }
          studentCounts[key].points += pts;
        });
        
        const sortedStudents = Object.values(studentCounts)
          .sort((a, b) => b.points - a.points);
          
        setAllStudentsRanking(sortedStudents);
      }
    } catch (e) {
      console.error("Error fetching top students", e);
    } finally {
      setLoadingTop10(false);
    }
  };

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase.from('pengaturan').select('key, value');
      if (data) {
        const pPrice = data.find(d => d.key === 'kasih_ibu_point_price')?.value;
        const fName = data.find(d => d.key === 'kasih_ibu_name')?.value;
        const fIcon = data.find(d => d.key === 'kasih_ibu_icon')?.value;
        
        if (pPrice) setPointPrice(pPrice);
        if (fName) setFeatureName(fName);
        if (fIcon) setFeatureIcon(fIcon);
      }
    } catch (e) {
      console.error("Error fetching config", e);
    }
  };

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const { data, error } = await supabase.from('kasih_ibu').select('kelas');
      if (data) {
        const counts: Record<string, number> = {};
        data.forEach(item => {
          const k = item.kelas || 'Tidak Diketahui';
          counts[k] = (counts[k] || 0) + 1;
        });
        
        const statsArray = Object.keys(counts).map(k => ({
          kelas: k,
          perolehan: counts[k]
        })).sort((a, b) => b.perolehan - a.perolehan);
        
        setClassStats(statsArray);
      }
    } catch (e) {
      console.error("Error fetching stats", e);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleClassClick = async (data: any) => {
    if (!data || !data.activePayload || !data.activePayload[0]) return;
    const kelas = data.activePayload[0].payload.kelas;
    setSelectedClass(kelas);
    setLoadingTop(true);
    try {
      // Fetch all points for this class
      const { data: records } = await supabase.from('kasih_ibu').select('nama_murid, nisn, validasi_walikelas, jenis_kebiasaan').eq('kelas', kelas);
      if (records) {
        const studentCounts: Record<string, { nama: string, points: number, nisn: string }> = {};
        records.forEach(r => {
          const key = r.nisn || r.nama_murid;
          if (!studentCounts[key]) {
            studentCounts[key] = { nama: r.nama_murid, points: 0, nisn: r.nisn };
          }
          let pts = 0;
          if (r.jenis_kebiasaan && r.jenis_kebiasaan.startsWith('Tukar Poin')) {
            const match = r.jenis_kebiasaan.match(/\(-(\d+)\)/);
            if (match) pts = -parseInt(match[1]);
          } else if (r.validasi_walikelas === 'Valid') {
            const matchedKey = Object.keys(HABIT_POINTS).find(k => k.toLowerCase() === r.jenis_kebiasaan?.toLowerCase());
            if (matchedKey) pts = HABIT_POINTS[matchedKey].points;
          }
          studentCounts[key].points += pts;
        });
        
        const sortedStudents = Object.values(studentCounts)
          .sort((a, b) => b.points - a.points)
          .slice(0, 5); // Top 5
          
        setTopStudents(sortedStudents);
      }
    } catch (e) {
      console.error("Error fetching top students", e);
    } finally {
      setLoadingTop(false);
    }
  };

  const handleSaveConfig = async () => {
    setLoading(true);
    try {
      const updates = [
        { key: 'kasih_ibu_point_price', value: pointPrice },
        { key: 'kasih_ibu_name', value: featureName },
        { key: 'kasih_ibu_icon', value: featureIcon }
      ];
      
      const { error } = await supabase.from('pengaturan').upsert(updates);
      if (error) throw error;
      showToast("Konfigurasi Kasih Ibu berhasil disimpan", "success");
    } catch (e) {
      console.error("Error saving config", e);
      showToast("Gagal menyimpan konfigurasi", "error");
    } finally {
      setLoading(false);
    }
  };
  
  const SelectedIcon = availableIcons.find(i => i.name === featureIcon)?.icon || Heart;

  const availableClasses = Array.from(new Set(allStudentsRanking.map(s => s.kelas))).sort();
  const top10Students = allStudentsRanking
    .filter(s => selectedFilterClass === 'all' || s.kelas === selectedFilterClass)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-xl">
            <SelectedIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Konfigurasi Program</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Atur nama, ikon, dan harga per poin</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Nama Program
              </label>
              <input
                type="text"
                value={featureName}
                onChange={(e) => setFeatureName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                placeholder="Contoh: Kasih Ibu, Tabungan Kebaikan"
              />
              <p className="text-xs text-slate-500 mt-2">
                Nama ini akan ditampilkan pada dashboard Siswa, Guru, dan Tendik.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Pilih Ikon Program
              </label>
              <div className="flex flex-wrap gap-2">
                {availableIcons.map(icon => (
                  <button
                    key={icon.name}
                    onClick={() => setFeatureIcon(icon.name)}
                    className={`p-3 rounded-xl border flex items-center justify-center transition-all ${
                      featureIcon === icon.name 
                        ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-600' 
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <icon.icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Harga per Poin (Rp)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">Rp</span>
                <input
                  type="number"
                  value={pointPrice}
                  onChange={(e) => setPointPrice(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                  placeholder="Contoh: 100"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Nilai ini digunakan sebagai acuan saat siswa menukarkan poin dengan Alat Tulis Kantor (ATK).
              </p>
            </div>

            <button
              onClick={handleSaveConfig}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Simpan Konfigurasi
                </>
              )}
            </button>
          </div>
          
          <div className="border border-slate-100 dark:border-slate-700 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
             <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
               <Award className="w-5 h-5 text-pink-500" />
               Analisis Perolehan per Kelas
             </h3>
             <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
               Klik 2 kali pada salah satu bar grafik kelas untuk melihat 5 siswa terbaik di kelas tersebut.
             </p>
             
             {loadingStats ? (
               <div className="h-64 flex items-center justify-center">
                 <div className="w-8 h-8 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
               </div>
             ) : classStats.length === 0 ? (
               <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
                 Belum ada data perolehan
               </div>
             ) : (
               <div className="h-64 w-full cursor-pointer">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={classStats} margin={{ top: 10, right: 10, left: -20, bottom: 20 }} onClick={handleClassClick}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                     <XAxis dataKey="kelas" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} angle={-45} textAnchor="end" />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                     <RechartsTooltip 
                       cursor={{ fill: 'rgba(236, 72, 153, 0.1)' }}
                       contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                     />
                     <Bar dataKey="perolehan" name="Total Perolehan" radius={[4, 4, 0, 0]}>
                       {classStats.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#ec4899' : '#f472b6'} />
                       ))}
                     </Bar>
                   </BarChart>
                 </ResponsiveContainer>
               </div>
             )}
          </div>
        </div>
      </div>
      
      {/* Top 10 Students Dashboard */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-xl">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Peringkat 10 Besar {featureName}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {selectedFilterClass === 'all' ? 'Daftar siswa dengan poin terbanyak di semua kelas' : `Daftar siswa dengan poin terbanyak di ${selectedFilterClass}`}
              </p>
            </div>
          </div>
          <div className="flex overflow-x-auto gap-2 pb-2 md:pb-0 scrollbar-hide">
            <button
              onClick={() => setSelectedFilterClass('all')}
              className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                selectedFilterClass === 'all'
                  ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              Semua Kelas
            </button>
            {availableClasses.map(kelas => (
              <button
                key={kelas}
                onClick={() => setSelectedFilterClass(kelas)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  selectedFilterClass === kelas
                    ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                {kelas}
              </button>
            ))}
          </div>
        </div>

        {loadingTop10 ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
          </div>
        ) : top10Students.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            Belum ada data perolehan poin.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {top10Students.map((student, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-sm ${
                  idx === 0 ? 'bg-yellow-400 text-yellow-900 ring-4 ring-yellow-400/20' : 
                  idx === 1 ? 'bg-slate-300 text-slate-700 ring-4 ring-slate-300/20' :
                  idx === 2 ? 'bg-orange-300 text-orange-900 ring-4 ring-orange-300/20' :
                  'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                }`}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 dark:text-white truncate">{student.nama}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">{student.kelas}</span>
                    <span className="truncate">{student.nisn}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-pink-600 dark:text-pink-400">
                    {student.points}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    Poin
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Top Students Modal */}
      {selectedClass && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold">
                <Medal className="w-5 h-5 text-yellow-500" />
                <span>Top 5 - {selectedClass}</span>
              </div>
              <button 
                onClick={() => setSelectedClass(null)}
                className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4">
              {loadingTop ? (
                <div className="py-8 flex justify-center">
                   <div className="w-6 h-6 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
                </div>
              ) : topStudents.length === 0 ? (
                <div className="py-8 text-center text-slate-500">
                  Belum ada data perolehan di kelas ini.
                </div>
              ) : (
                <div className="space-y-3">
                  {topStudents.map((student, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          idx === 0 ? 'bg-yellow-100 text-yellow-700' : 
                          idx === 1 ? 'bg-slate-200 text-slate-700' :
                          idx === 2 ? 'bg-orange-100 text-orange-700' :
                          'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-white text-sm">{student.nama}</p>
                          <p className="text-xs text-slate-500">{student.nisn}</p>
                        </div>
                      </div>
                      <div className="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 px-3 py-1 rounded-full text-xs font-bold">
                        {student.points} Poin
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
