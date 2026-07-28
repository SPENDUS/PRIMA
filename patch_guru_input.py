import re

with open('src/pages/Pelanggaran.tsx', 'r') as f:
    content = f.read()

# 1. Add state for penanganan
if 'const [penanganan, setPenanganan] = useState(false);' not in content:
    content = content.replace("const [pelanggaranDesc, setPelanggaranDesc] = useState('');", "const [pelanggaranDesc, setPelanggaranDesc] = useState('');\n  const [penanganan, setPenanganan] = useState(false);")

# 2. Update handleSubmit
old_catatan = "catatan: [{ type: pelanggaranDesc, student: selectedSiswa }],"
new_catatan = "catatan: [{ type: pelanggaranDesc, student: selectedSiswa, penanganan: penanganan ? 'Sudah Ditangani' : null }],"
if old_catatan in content:
    content = content.replace(old_catatan, new_catatan)

# 3. Add to UI
ui_field = """            </div>

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

            <button"""
content = content.replace("            </div>\n\n            <button", ui_field)

# 4. Reset penanganan on success
old_reset = """          setKelas('');
          setSelectedSiswa('');
          setPelanggaranDesc('');"""
new_reset = """          setKelas('');
          setSelectedSiswa('');
          setPelanggaranDesc('');
          setPenanganan(false);"""
if old_reset in content:
    content = content.replace(old_reset, new_reset)

with open('src/pages/Pelanggaran.tsx', 'w') as f:
    f.write(content)
