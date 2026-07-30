const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const target = `const { data: user } = await supabase.from('guru').select('nip, nama_guru, target_jp, mengajar').eq('nip', nip).eq('password', password).single();`;
const replacement = `const { data: user } = await supabase.from('guru').select('nip, nama_guru, target_jp, mengajar, "Wali_Kelas"').eq('nip', nip).eq('password', password).single();`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('server.ts', code);
    console.log("Patched server.ts login query");
} else {
    console.log("Target not found");
}

const loginResultTarget = `user: {
            role: 'guru',
            NIP: user.nip,
            'Nama Guru': user.nama_guru,
          }`;
const loginResultReplacement = `user: {
            role: 'guru',
            NIP: user.nip,
            'Nama Guru': user.nama_guru,
            waliKelas: user.Wali_Kelas,
          }`;

if (code.includes(loginResultTarget)) {
    code = code.replace(loginResultTarget, loginResultReplacement);
    fs.writeFileSync('server.ts', code);
    console.log("Patched server.ts login result");
} else {
    console.log("Login result target not found");
}
