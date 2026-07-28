import re

with open('src/pages/PublicDashboard.tsx', 'r') as f:
    content = f.read()

# Add state
state_target = "  const [realVisitor, setRealVisitor] = useState(0);"
state_replacement = """  const [realVisitor, setRealVisitor] = useState(0);
  const [expandedGrade, setExpandedGrade] = useState<string | null>(null);"""
content = content.replace(state_target, state_replacement)

# Replace class grid
grid_target = """            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {['7A', '7B', '7C', '7D', '7E', '8A', '8B', '8C', '8D', '8E', '9A', '9B', '9C', '9D', '9E', '9F'].map((k, idx) => {
                const colors = [
                  'from-red-400 to-red-600 shadow-red-500/40',
                  'from-orange-400 to-orange-600 shadow-orange-500/40',
                  'from-yellow-400 to-yellow-600 shadow-yellow-500/40',
                  'from-green-400 to-green-600 shadow-green-500/40',
                  'from-blue-400 to-blue-600 shadow-blue-500/40',
                  'from-purple-400 to-purple-600 shadow-purple-500/40',
                  'from-pink-400 to-pink-600 shadow-pink-500/40',
                  'from-indigo-400 to-indigo-600 shadow-indigo-500/40',
                  'from-teal-400 to-teal-600 shadow-teal-500/40',
                  'from-cyan-400 to-cyan-600 shadow-cyan-500/40'
                ];
                const blobs = [
                  'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 
                  'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-cyan-500'
                ];
                const colorIdx = idx % colors.length;
                return (
                <div key={k} className="bg-white dark:bg-slate-800 p-2 md:p-3 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group flex flex-col items-center gap-2 text-center">
                  {/* 3D Icon Container */}
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex-shrink-0 flex flex-col items-center justify-center transform transition-transform duration-500 group-hover:scale-110 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] bg-gradient-to-br ${colors[colorIdx]}`}>
                    <Backpack className="w-5 h-5 text-white drop-shadow-md" />
                  </div>
                  
                  <div className="flex flex-col min-w-0 flex-1 w-full">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider truncate">Kelas {k}</span>
                    <span className="text-xl md:text-2xl font-black text-slate-800 dark:text-white leading-none truncate">
                      {data[`kelas${k}`] || 0}
                    </span>
                  </div>
                  {/* Decorative background blob */}
                  <div className={`absolute -right-4 -bottom-4 w-20 h-20 rounded-full opacity-5 blur-2xl ${blobs[colorIdx]}`}></div>
                </div>
              );})}
            </div>"""

grid_replacement = """            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {['7', '8', '9'].map((grade) => {
                  const gradeClasses = Object.keys(data).filter(k => k.startsWith(`kelas${grade}`) && k.length === 7).map(k => k.replace('kelas', ''));
                  const fallbackClasses = grade === '7' ? ['7A', '7B', '7C', '7D', '7E'] : grade === '8' ? ['8A', '8B', '8C', '8D', '8E'] : ['9A', '9B', '9C', '9D', '9E', '9F'];
                  const actualClasses = gradeClasses.length > 0 ? gradeClasses : fallbackClasses;
                  
                  const totalStudents = actualClasses.reduce((sum, cls) => sum + (data[`kelas${cls}`] || 0), 0);
                  const isExpanded = expandedGrade === grade;
                  
                  return (
                    <div key={grade} className="flex flex-col gap-4">
                      <button 
                        onClick={() => setExpandedGrade(isExpanded ? null : grade)}
                        className={`bg-white dark:bg-slate-800 p-4 rounded-3xl border shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group flex items-center justify-between text-left ${isExpanded ? 'border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500/20' : 'border-slate-100 dark:border-slate-700'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] bg-gradient-to-br ${grade === '7' ? 'from-blue-400 to-blue-600 shadow-blue-500/40' : grade === '8' ? 'from-purple-400 to-purple-600 shadow-purple-500/40' : 'from-orange-400 to-orange-600 shadow-orange-500/40'}`}>
                            <GraduationCap className="w-6 h-6 text-white drop-shadow-md" />
                          </div>
                          <div>
                            <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block mb-1">Total Siswa</span>
                            <span className="text-2xl font-black text-slate-800 dark:text-white leading-none flex items-center gap-2">
                              Kelas {grade}
                            </span>
                          </div>
                        </div>
                        <div className="text-3xl font-black text-slate-800 dark:text-white">
                          {totalStudents}
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
              
              <AnimatePresence>
                {expandedGrade && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700/50">
                      {(expandedGrade === '7' ? ['7A', '7B', '7C', '7D', '7E'] : expandedGrade === '8' ? ['8A', '8B', '8C', '8D', '8E'] : ['9A', '9B', '9C', '9D', '9E', '9F']).map((k, idx) => {
                        const colors = [
                          'from-red-400 to-red-600 shadow-red-500/40',
                          'from-orange-400 to-orange-600 shadow-orange-500/40',
                          'from-yellow-400 to-yellow-600 shadow-yellow-500/40',
                          'from-green-400 to-green-600 shadow-green-500/40',
                          'from-blue-400 to-blue-600 shadow-blue-500/40',
                          'from-purple-400 to-purple-600 shadow-purple-500/40',
                          'from-pink-400 to-pink-600 shadow-pink-500/40',
                          'from-indigo-400 to-indigo-600 shadow-indigo-500/40',
                          'from-teal-400 to-teal-600 shadow-teal-500/40',
                          'from-cyan-400 to-cyan-600 shadow-cyan-500/40'
                        ];
                        const blobs = [
                          'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 
                          'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-cyan-500'
                        ];
                        const colorIdx = idx % colors.length;
                        return (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            key={k} 
                            className="bg-white dark:bg-slate-800 p-2 md:p-3 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group flex flex-col items-center gap-2 text-center border border-slate-100 dark:border-slate-700"
                          >
                            {/* 3D Icon Container */}
                            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex-shrink-0 flex flex-col items-center justify-center transform transition-transform duration-500 group-hover:scale-110 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] bg-gradient-to-br ${colors[colorIdx]}`}>
                              <Backpack className="w-5 h-5 text-white drop-shadow-md" />
                            </div>
                            
                            <div className="flex flex-col min-w-0 flex-1 w-full">
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider truncate">Kelas {k}</span>
                              <span className="text-xl md:text-2xl font-black text-slate-800 dark:text-white leading-none truncate">
                                {data[`kelas${k}`] || 0}
                              </span>
                            </div>
                            {/* Decorative background blob */}
                            <div className={`absolute -right-4 -bottom-4 w-20 h-20 rounded-full opacity-5 blur-2xl ${blobs[colorIdx]}`}></div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>"""

content = content.replace(grid_target, grid_replacement)

with open('src/pages/PublicDashboard.tsx', 'w') as f:
    f.write(content)
