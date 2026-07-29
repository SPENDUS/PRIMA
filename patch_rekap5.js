const fs = require('fs');
let code = fs.readFileSync('src/pages/RekapAbsensi.tsx', 'utf-8');

const target = `const { data: jurnalData, error: jurnalError } = await supabase.from('jurnal').select('timestamp, ketidakhadiran, jam_pembelajaran').eq('kelas', kelas);`;
const replacement = `const jurnalKelas = String(kelas).toUpperCase().replace('KELAS', '').trim();
        const { data: jurnalData, error: jurnalError } = await supabase.from('jurnal').select('timestamp, ketidakhadiran, jam_pembelajaran').eq('kelas', jurnalKelas);`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/pages/RekapAbsensi.tsx', code);
    console.log("Patched successfully");
} else {
    console.log("Target not found");
}
