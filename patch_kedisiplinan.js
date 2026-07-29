const fs = require('fs');
let code = fs.readFileSync('src/pages/Kedisiplinan.tsx', 'utf-8');

const target = `const { data: studentsData, error: studentsError } = await supabase
          .from('murid')
          .select('"NISN", "Nama Lengkap", "Kelas"')
          .eq('"Kelas"', kelas);`;
const replacement = `const { data: studentsData, error: studentsError } = await supabase
          .from('murid')
          .select('"NISN", "Nama Lengkap", "Kelas"')
          .eq('"Kelas"', 'Kelas ' + kelas);`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/pages/Kedisiplinan.tsx', code);
    console.log("Patched successfully");
} else {
    console.log("Target not found");
}
