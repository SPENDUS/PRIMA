import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Add state
target_state = """  const [logoKop, setLogoKop] = useState("");"""
replacement_state = """  const [logoKop, setLogoKop] = useState("");
  const [bgLogin, setBgLogin] = useState("");"""
content = content.replace(target_state, replacement_state)

# Fetch settings block 1
target_fetch1 = """          setLogoKop(data.logoKop || "");"""
replacement_fetch1 = """          setLogoKop(data.logoKop || "");
          setBgLogin(data.bgLogin || "");"""
content = content.replace(target_fetch1, replacement_fetch1)

# Fetch settings block 2
target_fetch2 = """            setLogoKop(data.logoKop || "");"""
replacement_fetch2 = """            setLogoKop(data.logoKop || "");
            setBgLogin(data.bgLogin || "");"""
content = content.replace(target_fetch2, replacement_fetch2)

# Save settings
target_save = """      logoKop,
      tahunAjaran,"""
replacement_save = """      logoKop,
      bgLogin,
      tahunAjaran,"""
content = content.replace(target_save, replacement_save)

# Add input UI (insert after logoKop input)
target_input = """              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">KOP Surat (Wide)</label>
                <div className="flex gap-2">
                  <div className="w-16 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex-shrink-0 overflow-hidden border border-slate-200 dark:border-slate-600">
                    {logoKop ? <img src={logoKop} alt="KOP" className="w-full h-full object-contain" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><Upload className="w-4 h-4" /></div>}
                  </div>
                  <input 
                    type="text" 
                    value={logoKop}
                    onChange={(e) => setLogoKop(e.target.value)}
                    className="flex-1 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-700 dark:text-white text-sm focus:ring-2 focus:ring-slate-500 outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          </div>"""
          
replacement_input = target_input + """

          {/* Background Section */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase">Background & Login</h3>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">URL Gambar Background Login</label>
              <div className="flex gap-2">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex-shrink-0 overflow-hidden border border-slate-200 dark:border-slate-600">
                  {bgLogin ? <img src={bgLogin} alt="Background" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><Upload className="w-4 h-4" /></div>}
                </div>
                <input 
                  type="text" 
                  value={bgLogin}
                  onChange={(e) => setBgLogin(e.target.value)}
                  className="flex-1 border border-slate-300 dark:border-slate-600 rounded-full px-4 py-2 bg-slate-50 dark:bg-slate-700 dark:text-white text-sm focus:ring-2 focus:ring-slate-500 outline-none"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>"""

content = content.replace(target_input, replacement_input)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)

