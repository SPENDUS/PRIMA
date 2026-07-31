const fs = require('fs');
let code = fs.readFileSync('src/pages/Laporan.tsx', 'utf-8');

const target = `<h4 className="text-xl font-semibold mt-1">Jurnal Guru: {user?.['Nama Guru']}</h4>`;
const replacement = `<h4 className="text-xl font-semibold mt-1">{isTendik ? 'Jurnal Tendik:' : 'Jurnal Guru:'} {user?.['Nama Guru']}</h4>`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/pages/Laporan.tsx', code);
    console.log("Patched");
} else {
    console.log("Target not found");
}
