const fs = require('fs');
let code = fs.readFileSync('src/pages/KasihIbuGuru.tsx', 'utf-8');

const target1 = `  const fetchReports = async () => {`;
const replacement1 = `  const normalizedWaliKelas = user?.waliKelas ? String(user?.waliKelas).toLowerCase().replace('kelas', '').trim() : '';
  const normalizedSelectedClass = String(selectedClass).toLowerCase().replace('kelas', '').trim();
  const canValidate = user?.role === 'admin' || normalizedWaliKelas === 'bk' || (normalizedWaliKelas && normalizedWaliKelas === normalizedSelectedClass);

  const fetchReports = async () => {`;

const target2 = `        <div className="flex flex-col items-end gap-2">
          <button
            onClick={handleBulkValidateClick}
            disabled={isValidating || reports.filter(r => r.status === 'Belum').length === 0}
            className="bg-green-500 hover:bg-green-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-colors"
          >
            <CheckCircle className="w-5 h-5" />
            Validasi Massal ({reports.filter(r => r.status === 'Belum').length})
          </button>`;
const replacement2 = `        <div className="flex flex-col items-end gap-2">
          {canValidate && (
            <button
              onClick={handleBulkValidateClick}
              disabled={isValidating || reports.filter(r => r.status === 'Belum').length === 0}
              className="bg-green-500 hover:bg-green-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-colors"
            >
              <CheckCircle className="w-5 h-5" />
              Validasi Massal ({reports.filter(r => r.status === 'Belum').length})
            </button>
          )}`;

const target3 = `                              <>
                                <button 
                                  onClick={() => handleValidate(report.id, 'Ditolak')}
                                  className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                  title="Tolak"
                                >
                                  <XCircle className="w-5 h-5" />
                                </button>
                                <button 
                                  onClick={() => handleValidate(report.id, 'Valid')}
                                  className="p-2 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                  title="Validasi"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                </button>
                              </>`;
const replacement3 = `                              canValidate && (
                              <>
                                <button 
                                  onClick={() => handleValidate(report.id, 'Ditolak')}
                                  className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                  title="Tolak"
                                >
                                  <XCircle className="w-5 h-5" />
                                </button>
                                <button 
                                  onClick={() => handleValidate(report.id, 'Valid')}
                                  className="p-2 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                  title="Validasi"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                </button>
                              </>
                              )`;

if (code.includes(target1)) code = code.replace(target1, replacement1);
else console.log("target1 missing");

if (code.includes(target2)) code = code.replace(target2, replacement2);
else console.log("target2 missing");

if (code.includes(target3)) code = code.replace(target3, replacement3);
else console.log("target3 missing");

fs.writeFileSync('src/pages/KasihIbuGuru.tsx', code);
console.log("Patched KasihIbuGuru.tsx");
