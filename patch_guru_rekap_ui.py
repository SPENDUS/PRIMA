import re

with open('src/pages/Pelanggaran.tsx', 'r') as f:
    content = f.read()

# 1. Add missing imports if needed
if 'import { AlertTriangle' in content:
    content = content.replace("import { AlertTriangle", "import { AlertTriangle, Edit2, Trash2")

# 2. Add state and functions for Edit and Delete
state_add = """
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
"""
content = content.replace("  const [rekapData, setRekapData] = useState<any[]>([]);", "  const [rekapData, setRekapData] = useState<any[]>([]);" + state_add)

# 3. Add column header
content = content.replace('<th className="px-6 py-4 font-semibold">Status Penanganan</th>', '<th className="px-6 py-4 font-semibold">Status Penanganan</th>\n                                <th className="px-6 py-4 font-semibold text-right">Aksi</th>')

# 4. Add cell actions and fetch id inside rincian
if 'id: j.id,' not in content:
    content = content.replace("date: new Date(j.timestamp).toLocaleDateString('id-ID'),", "id: j.id,\n                    date: new Date(j.timestamp).toLocaleDateString('id-ID'),")

actions_html = """                                  <td className="px-6 py-4">
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
                                  </td>"""
content = content.replace("""                                  <td className="px-6 py-4">
                                     {r.penanganan ? (
                                       <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium border border-green-200">Ditangani</span>
                                     ) : (
                                       <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-medium border border-yellow-200">Belum</span>
                                     )}
                                  </td>""", actions_html)

# 5. Add Modal at the end (before last </div>)
modal_html = """
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
"""
content = content.replace("    </div>\n  );\n}", modal_html + "    </div>\n  );\n}")

with open('src/pages/Pelanggaran.tsx', 'w') as f:
    f.write(content)
