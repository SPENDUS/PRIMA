const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const loginResultTarget = `user: {
            role: 'guru',
            NIP: user.nip,
            'Nama Guru': user.nama_guru,
            Mengajar: user.mengajar
          }`;
const loginResultReplacement = `user: {
            role: 'guru',
            NIP: user.nip,
            'Nama Guru': user.nama_guru,
            Mengajar: user.mengajar,
            waliKelas: user.Wali_Kelas
          }`;

if (code.includes(loginResultTarget)) {
    code = code.replace(loginResultTarget, loginResultReplacement);
    fs.writeFileSync('server.ts', code);
    console.log("Patched server.ts login result 2");
} else {
    console.log("Login result target not found 2");
}
