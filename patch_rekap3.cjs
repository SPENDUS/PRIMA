const fs = require('fs');
let code = fs.readFileSync('src/pages/RekapAbsensi.tsx', 'utf-8');

code = code.replace(/Tanggal: \{new Date\(filterTanggal\).toLocaleDateString\('id-ID', \{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' \}\)\}/g,
"Tanggal: {new Date(startDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })} - {new Date(endDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}");

fs.writeFileSync('src/pages/RekapAbsensi.tsx', code);
