const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const target = `    } else if (role === 'tendik') {
      const { data: user } = await supabase.from('tendik').select('nip, nama_tendik').eq('nip', nip).eq('password', password).single();
      if (user) {
        return res.json({ success: true, user: { role: 'tendik', NIP: user.nip, 'Nama Guru': user.nama_tendik } });
      }`;

const replacement = `    } else if (role === 'tendik') {
      const { data: user } = await supabase.from('tendik').select('nip, nama_tendik, jabatan').eq('nip', nip).eq('password', password).single();
      if (user) {
        return res.json({ success: true, user: { role: 'tendik', NIP: user.nip, 'Nama Guru': user.nama_tendik, Jabatan: user.jabatan || 'Tenaga Kependidikan' } });
      }`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('server.ts', code);
    console.log("Patched server.ts tendik login");
}
