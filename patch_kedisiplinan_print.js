const fs = require('fs');
let code = fs.readFileSync('src/pages/Kedisiplinan.tsx', 'utf-8');

const importTarget = `import { ArrowLeft, Calendar, Search, X } from 'lucide-react';`;
const importReplacement = `import { ArrowLeft, Calendar, Search, X, Printer } from 'lucide-react';`;
if (code.includes(importTarget)) {
    code = code.replace(importTarget, importReplacement);
}

const headerTarget = `<div className="max-w-7xl mx-auto bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>`;
const headerReplacement = `<div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 print:hidden flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4 w-full md:w-auto flex-1">
            <div className="flex-1 min-w-[200px]">`;
if (code.includes(headerTarget)) {
    code = code.replace(headerTarget, headerReplacement);
}

const inputsTarget = `</div>
          </div>

          <div className="border-b border-slate-200 dark:border-slate-700 mb-6">`;
const inputsReplacement = `</div>
          </div>
          <button
            onClick={() => window.print()}
            disabled={!kelas}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-50 mt-4 md:mt-0"
          >
            <Printer className="w-5 h-5" /> Cetak
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 print:border-none print:shadow-none print:p-0">
          <div className="border-b border-slate-200 dark:border-slate-700 mb-6 print:hidden">`;
if (code.includes(inputsTarget)) {
    code = code.replace(inputsTarget, inputsReplacement);
}

const closeTarget = `</main>
    </div>`;
const closeReplacement = `</div>
      </main>
    </div>`;
if (code.includes(closeTarget)) {
    // we added one more div, so we need to close it. wait, no we closed the first div above, and opened a new one. The number of divs is the same. Let's verify.
}

fs.writeFileSync('src/pages/Kedisiplinan.tsx', code);
console.log("Patched Kedisiplinan.tsx");
