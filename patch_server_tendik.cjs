const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const target = `    const { error } = await supabase.from('jurnal').insert({
        nama_guru: nama,
        kelas: 'Tendik',
        mata_pelajaran: 'Aktivitas Harian',
        materi: aktivitas,
        jam_pembelajaran: '-',
        jumlah_jam: 0,
        siswa_hadir: 0,
        siswa_ijin: 0,
        siswa_sakit: 0,
        siswa_alpha: 0,
        kebersihan_kelas: 'Baik',
        timestamp: new Date().toISOString() // Use current time or passed date
    });`;

const replacement = `    const { error } = await supabase.from('jurnal').insert({
        nip: nip,
        nama_guru: nama,
        kelas: 'Tendik',
        mata_pelajaran: 'Aktivitas Harian',
        materi: aktivitas,
        jam_pembelajaran: '-',
        ketidakhadiran: 'Nihil',
        catatan_mengajar: 'Nihil',
        kebersihan_kelas: 'Baik',
        validasi: 'Belum',
        guru_piket_inval: '-',
        timestamp: new Date().toISOString() // Use current time or passed date
    });`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('server.ts', code);
    console.log("Patched server.ts tendik");
} else {
    console.log("Target not found");
}
