import re

with open('src/pages/MainDashboard.tsx', 'r') as f:
    content = f.read()

# Add state variables
state_vars = """
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editNip, setEditNip] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [loadingEdit, setLoadingEdit] = useState(false);

  const openEditProfile = () => {
    setEditName(user?.['Nama Guru'] || user?.Nama || user?.Nama_Tendik || '');
    setEditNip(user?.NIP || user?.Username || '');
    setEditPassword('');
    setShowEditProfile(true);
  };

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingEdit(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: user?.role,
          oldNip: user?.NIP || user?.Username,
          newNip: editNip,
          newNama: editName,
          newPassword: editPassword || undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Data berhasil diperbarui. Silakan login kembali dengan data baru.');
        onLogout();
      } else {
        alert('Gagal mengupdate profil: ' + data.message);
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setLoadingEdit(false);
    }
  };
"""

if "const [showEditProfile, setShowEditProfile] = useState(false);" not in content:
    content = content.replace("const [KasihIbuIcon, setKasihIbuIcon] = useState<any>(HeartHandshake);", "const [KasihIbuIcon, setKasihIbuIcon] = useState<any>(HeartHandshake);\n" + state_vars)

# Replace the button
old_button = """                <button className="mt-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                  Ubah Password
                </button>"""
new_button = """                { (user?.role === 'guru' || user?.role === 'tendik') && (
                  <button 
                    onClick={openEditProfile}
                    className="mt-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    Edit Data
                  </button>
                )}"""
if old_button in content:
    content = content.replace(old_button, new_button)

# Add Modal at the bottom of the component (before final `);`)
modal_html = """
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">Edit Data Profil</h3>
              <button onClick={() => setShowEditProfile(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleEditProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">ID / NIP</label>
                <input 
                  type="text" 
                  value={editNip}
                  onChange={(e) => setEditNip(e.target.value)}
                  className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Ganti Password (Kosongkan jika tidak ingin diubah)</label>
                <input 
                  type="password" 
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Masukkan password baru..."
                  className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowEditProfile(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 rounded-xl font-bold transition-colors">Batal</button>
                <button type="submit" disabled={loadingEdit} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg transition-all disabled:opacity-50">
                  {loadingEdit ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
"""
if "{showEditProfile && (" not in content:
    content = content.replace("    </div>\n  );\n}", modal_html + "    </div>\n  );\n}")

with open('src/pages/MainDashboard.tsx', 'w') as f:
    f.write(content)
