import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit2, Trash2, X, Send, CheckCircle2, ClipboardList, PlusCircle, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Pelanggaran({ user, onNavigate }: { user: any, onNavigate: (page: string) => void }) {
  const [kelas, setKelas] = useState('');
  const [siswaList, setSiswaList] = useState<any[]>([]);
  const [selectedSiswa, setSelectedSiswa] = useState('');
  const [pelanggaranDesc, setPelanggaranDesc] = useState('');
  const [penanganan, setPenanganan] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('input');
  const [rekapData, setRekapData] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editDesc, setEditDesc] = useState('');
  const [editPenanganan, setEditPenanganan] = useState(false);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Yakin ingin menghapus pelanggaran ini?')) return;
    try {
      const res = await fetch(`/api/pelanggaran/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchRekap();
      } else {
        alert('Gagal menghapus');
      }
    } catch (e) {
      alert('Terjadi kesalahan');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      const res = await fetch(`/api/pelanggaran/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: editDesc,
          penanganan: editPenanganan ? 'Sudah Ditangani' : null
        })
      });
      const data = await res.json();
      if (data.success) {
        setEditingItem(null);
        fetchRekap();
      } else {
        alert('Gagal mengupdate');
      }
    } catch (e) {
      alert('Terjadi kesalahan');
    }
  };

  const [loadingRekap, setLoadingRekap] = useState(false);


  const criteriaList = [
    { label: "Kriteria A (Pelanggaran Berat)", options: [
      { id: "A1", desc: "A1: Terbukti membawa/memakai/mengedarkan narkoba dan miras (50 poin)" },
      { id: "A2", desc: "A2: Berbuat asusila/tidak senonoh/berpacaran/bermesraan di lingkungan sekolah (40 poin)" },
      { id: "A3", desc: "A3: Menyerang guru atau personil sekolah lainnya (30 poin)" },
      { id: "A4", desc: "A4: Mencuri, menarget (memalak) mengambil uang atau barang di sekolah (30 poin)" },
      { id: "A5", desc: "A5: Membawa vcd, buku, film, file, laptop, tablet, HP, dll yang berisi pornografi (20 poin)" },
      { id: "A6", desc: "A6: Berjudi di lingkungan sekolah (20 poin)" },
      { id: "A7", desc: "A7: Berkelahi di dalam maupun di luar sekolah (20 poin)" },
      { id: "A8", desc: "A8: Membawa dan atau merokok di lingkungan sekolah (20 poin)" },
      { id: "A9", desc: "A9: Badan bertato, hidung bertindik, telinga bertindik (putra) (15 poin)" },
      { id: "A10", desc: "A10: Membawa senjata tajam atau peralatan yang membahayakan orang lain (15 poin)" },
      { id: "A11", desc: "A11: Melakukan konvoi motor/balap motor/terlibat gang motor dll. (15 poin)" },
      { id: "A12", desc: "A12: Merusak sarana/prasarana sekolah (15 poin)" },
      { id: "A13", desc: "A13: Membawa dan atau menyalakan petasan/mercon (10 poin)" },
      { id: "A14", desc: "A14: Bersikap tidak sopan, kuarang ajar terhadap guru, personil sekolah dan tamu (10 poin)" },
      { id: "A15", desc: "A15: Melompat pagar / meninggalkan sekolah sebelum kegiatan sekolah berakhir (10 poin)" },
      { id: "A16", desc: "A16: Merusak, menjahili, mengambil tanaman di lingkungan sekolah (10 poin)" }
    ]},
    { label: "Kriteria B (Pelanggaran Sedang)", options: [
      { id: "B1a", desc: "B1: Datang terlambat lebih dari 5 menit (1-3 kali) - 2 poin" },
      { id: "B1b", desc: "B1: Datang terlambat lebih dari 5 menit (4-6 kali) - 4 poin" },
      { id: "B1c", desc: "B1: Datang terlambat lebih dari 5 menit (>7 kali) - 8 poin" },
      { id: "B2a", desc: "B2: Tidak masuk sekolah tanpa keterangan (1-3 kali) - 2 poin" },
      { id: "B2b", desc: "B2: Tidak masuk sekolah tanpa keterangan (4-6 kali) - 4 poin" },
      { id: "B2c", desc: "B2: Tidak masuk sekolah tanpa keterangan (7-9 kali) - 8 poin" },
      { id: "B2d", desc: "B2: Tidak masuk sekolah tanpa keterangan (>10 kali) - 10 poin" },
      { id: "B3", desc: "B3: Membawa HP di lingkungan sekolah (HP disita dikembalikan ketika kenaikan kelas) (5 poin)" },
      { id: "B4", desc: "B4: Menggunakan laptop/tablet dll untuk bermain/games di lingkungan sekolah (5 poin)" },
      { id: "B5", desc: "B5: Membawa kendaraan bermotor di area sekolah (5 poin)" },
      { id: "B6", desc: "B6: Mengancam atau mengintimidasi (membully) teman (5 poin)" },
      { id: "B7", desc: "B7: Memutar film (bukan pelajaran) di lingkungan sekolah (5 poin)" },
      { id: "B9", desc: "B9: Mengumpat atau berkata jorok/kotor atau menghina orang tua teman (5 poin)" },
      { id: "B10", desc: "B10: Bermain bola di dalam/di sekitar kelas (5 poin)" },
      { id: "B11", desc: "B11: Rambut panjang/tidak rapi(putra), rambut diwarna, kuku panjang, kuku diwarna (5 poin)" },
      { id: "B12", desc: "B12: Mencoret-coret baju pada saat pengumuman kelulusan (5 poin)" },
      { id: "B13", desc: "B13: Tidak mengikuti upacara tanpa ijin (3 poin)" },
      { id: "B14", desc: "B14: Berolahraga tidak menggunakan kaos/seragam olahraga (3 poin)" }
    ]},
    { label: "Kriteria C (Pelanggaran Ringan)", options: [
      { id: "C1", desc: "C1: Tidak mengerjakan tugas yang diberikan guru di dalam kelas maupun PR di rumah (2 poin)" },
      { id: "C2", desc: "C2: Tidak hadir dalam kegiatan ekstra kurikuler wajib dan yang diwajibkan sekolah (2 poin)" },
      { id: "C3", desc: "C3: Tidak memakai seragam yang sesuai / sepatu tidak hitam /sabuk/kaos kaki tidak sesuai dan tidak rapi bajunya(dikeluarkan bajunya) (2 poin)" },
      { id: "C4", desc: "C4: Seragam tidak lengkap (topi, dasi, atribut, nama dada, ikat pinggang, dll) (2 poin)" },
      { id: "C5", desc: "C5: Bersolek berlebihan, memakai perhiasan mewah memakai hena atau pewarna kuku (2 poin)" },
      { id: "C6", desc: "C6: Memakai kaos kaki dengan Logo SMP disembunyikan/diturunkan (2 poin)" },
      { id: "C7", desc: "C7: Model pakaian seragam tidak sesuai/tidak sopan (model rok/celana pinggul, di atas lutut) dll. (2 poin)" },
      { id: "C8", desc: "C8: Tidak menata kembali sarung atau mukenah setelah selesai menggunakannya (1 poin)" },
      { id: "C9", desc: "C9: Sepatu menginjak/naik ke lantai trap (suci) musholla (1 poin)" },
      { id: "C10", desc: "C10: Duduk-duduk di area parkir motor/mobil guru/karyawan ketika istirahat (1 poin)" },
      { id: "C11", desc: "C11: Berada diluar kelas ketika Jam Pembelajaran (1 poin)" },
      { id: "C12", desc: "C12: Tidak tertib di dalam kelas, ramai, dan berbicara sendiri (1 poin)" },
      { id: "C13", desc: "C13: Membuang sampah tidak di tempat sampah (1 poin)" },
      { id: "C14", desc: "C14: Tidak melakukan piket kebersihan (1 poin)" },
      { id: "C15", desc: "C15: Tidak mengikuti kegiatan Jumat Bersih, Jumat Sehat dan Jumat Religi (1 poin)" }
    ]}
  ];

  useEffect(() => {
    fetch('/api/initial-data')
      .then(res => res.json())
      .then(data => setInitialData(data))
      .catch(err => console.error("Failed to fetch initial data", err));
  }, []);

  const uniqueKelas = Array.isArray(initialData?.murid) ? [...new Set(initialData.murid.map((m: any) => m.Kelas))].sort() : [];

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
        .or(`kelas.eq."${kelas}",kelas.eq."Kelas ${kelas}"`)
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
                  const match = d.type.match(/\((\d+)\s+poin\)/i);
                  let poin = match ? parseInt(match[1]) : 0;
                  
                  if (!pelanggaranMap[d.student]) {
                    pelanggaranMap[d.student] = { nama: d.student, totalPoin: 0, rincian: [] };
                  }
                  pelanggaranMap[d.student].totalPoin += poin;
                  pelanggaranMap[d.student].rincian.push({
                    id: j.id,
                    date: new Date(j.timestamp).toLocaleDateString('id-ID'),
                    type: d.type,
                    poin: poin,
                    guru: j.nama_guru,
                    penanganan: d.penanganan || null
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


  useEffect(() => {
    if (kelas && initialData && Array.isArray(initialData.murid)) {
      const normalizedSelectedClass = String(kelas).toLowerCase().replace('kelas', '').trim();
      const filtered = initialData.murid.filter((m: any) => {
         const mClass = String(m.Kelas).toLowerCase().replace('kelas', '').trim();
         return mClass === normalizedSelectedClass;
      });
      setSiswaList(filtered);
      setSelectedSiswa('');
    }
  }, [kelas, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kelas || !selectedSiswa || !pelanggaranDesc) return;
    setLoading(true);

    const formData = {
      nip: user.NIP || '-',
      guru: user['Nama Guru'],
      kelas: kelas,
      pembelajaran: [{ mataPelajaran: 'Pelanggaran', jamPembelajaran: [], materi: 'Catatan Pelanggaran' }],
      ketidakhadiran: {},
      catatan: [{ type: pelanggaranDesc, student: selectedSiswa, penanganan: penanganan ? 'Sudah Ditangani' : null }],
      kebersihanKelas: 'sudah_bersih',
      validasi: { status: 'Tidak Tervalidasi', guruPiketInval: '' }
    };

    try {
      const res = await fetch('/api/jurnal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setKelas('');
          setSelectedSiswa('');
          setPelanggaranDesc('');
          setPenanganan(false);
        }, 3000);
      } else {
        alert('Gagal menyimpan pelanggaran: ' + data.message);
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      <header className="bg-green-600 text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <button onClick={() => onNavigate('main')} className="p-2 hover:bg-green-700 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Pelanggaran</h1>
        </div>
      </header>

      <main className="p-4 max-w-4xl mx-auto mt-4">
        {showSuccess && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 p-4 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            <p className="font-medium">Data pelanggaran berhasil disimpan!</p>
          </div>
        )}

        
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
<div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Pilih Kelas</label>
              <select 
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-slate-50 dark:bg-slate-700 dark:text-white"
                required
              >
                <option value="">-- Pilih Kelas --</option>
                {uniqueKelas.map((k: any) => {
                  const val = String(k).toUpperCase().replace('KELAS', '').trim();
                  const label = String(k).toLowerCase().startsWith('kelas') ? k : `Kelas ${k}`;
                  return <option key={k} value={val}>{label}</option>;
                })}
              </select>
            </div>

            {kelas && (
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Pilih Siswa</label>
                <select 
                  value={selectedSiswa}
                  onChange={(e) => setSelectedSiswa(e.target.value)}
                  className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-slate-50 dark:bg-slate-700 dark:text-white"
                  required
                >
                  <option value="">-- Pilih Siswa --</option>
                  {siswaList.map((m: any, idx) => (
                    <option key={idx} value={m['Nama Murid']}>{m['Nama Murid']}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Jenis Pelanggaran</label>
              <select 
                value={pelanggaranDesc}
                onChange={(e) => setPelanggaranDesc(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-slate-50 dark:bg-slate-700 dark:text-white"
                required
              >
                <option value="">-- Pilih Jenis Pelanggaran --</option>
                {criteriaList.map((group, idx) => (
                  <optgroup key={idx} label={group.label}>
                    {group.options.map((opt) => (
                      <option key={opt.id} value={opt.desc}>{opt.desc}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={penanganan}
                  onChange={(e) => setPenanganan(e.target.checked)}
                  className="w-5 h-5 text-red-600 border-slate-300 rounded focus:ring-red-500"
                />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Tandai sudah ditangani</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !kelas || !selectedSiswa || !pelanggaranDesc}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              {loading ? 'Menyimpan...' : 'Simpan Pelanggaran'}
            </button>
          </form>
        </div>

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
               <div className="space-y-6">
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
                                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
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
                                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                                     <button onClick={() => { setEditingItem(r); setEditDesc(r.type); setEditPenanganan(!!r.penanganan); }} className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 rounded-lg transition-colors">
                                        <Edit2 className="w-4 h-4" />
                                     </button>
                                     <button onClick={() => handleDelete(r.id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-lg transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                     </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                     </div>
                  ))}
               </div>
            )}
          </div>
        )}

      </main>

      {editingItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">Edit Pelanggaran</h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Jenis Pelanggaran</label>
                <select 
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-slate-50 dark:bg-slate-700 dark:text-white"
                  required
                >
                  {criteriaList.map((group, idx) => (
                    <optgroup key={idx} label={group.label}>
                      {group.options.map((opt) => (
                        <option key={opt.id} value={opt.desc}>{opt.desc}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={editPenanganan}
                    onChange={(e) => setEditPenanganan(e.target.checked)}
                    className="w-5 h-5 text-red-600 border-slate-300 rounded focus:ring-red-500"
                  />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Tandai sudah ditangani</span>
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setEditingItem(null)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 rounded-xl font-bold transition-colors">Batal</button>
                <button type="submit" className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg transition-all">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
