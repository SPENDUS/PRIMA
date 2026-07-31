const fs = require('fs');
let code = fs.readFileSync('src/pages/KasihIbuAdmin.tsx', 'utf-8');

// Add import
if (!code.includes("import { HABIT_POINTS }")) {
  code = code.replace(
    `import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';`,
    `import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';\nimport { HABIT_POINTS } from '../utils/habitPoints';`
  );
}

// 1. fetchTop10
const fetchTop10Target = `const { data, error } = await supabase.from('kasih_ibu').select('nama_murid, kelas, nisn');
      if (data) {
        const studentCounts: Record<string, { nama: string, kelas: string, points: number, nisn: string }> = {};
        data.forEach(r => {
          const key = r.nisn || r.nama_murid;
          if (!studentCounts[key]) {
            studentCounts[key] = { nama: r.nama_murid, kelas: r.kelas || '-', points: 0, nisn: r.nisn };
          }
          studentCounts[key].points += 1;
        });`;
const fetchTop10Replacement = `const { data, error } = await supabase.from('kasih_ibu').select('nama_murid, kelas, nisn, validasi_walikelas, jenis_kebiasaan');
      if (data) {
        const studentCounts: Record<string, { nama: string, kelas: string, points: number, nisn: string }> = {};
        data.forEach(r => {
          const key = r.nisn || r.nama_murid;
          if (!studentCounts[key]) {
            studentCounts[key] = { nama: r.nama_murid, kelas: r.kelas || '-', points: 0, nisn: r.nisn };
          }
          let pts = 0;
          if (r.jenis_kebiasaan && r.jenis_kebiasaan.startsWith('Tukar Poin')) {
            const match = r.jenis_kebiasaan.match(/\\(-(\\d+)\\)/);
            if (match) pts = -parseInt(match[1]);
          } else if (r.validasi_walikelas === 'Valid') {
            const matchedKey = Object.keys(HABIT_POINTS).find(k => k.toLowerCase() === r.jenis_kebiasaan?.toLowerCase());
            if (matchedKey) pts = HABIT_POINTS[matchedKey].points;
          }
          studentCounts[key].points += pts;
        });`;
if (code.includes(fetchTop10Target)) {
    code = code.replace(fetchTop10Target, fetchTop10Replacement);
} else {
    console.log("fetchTop10Target not found!");
}

// 2. handleClassClick
const handleClassTarget = `const { data: records } = await supabase.from('kasih_ibu').select('nama_murid, nisn').eq('kelas', kelas);
      if (records) {
        const studentCounts: Record<string, { nama: string, points: number, nisn: string }> = {};
        records.forEach(r => {
          const key = r.nisn || r.nama_murid;
          if (!studentCounts[key]) {
            studentCounts[key] = { nama: r.nama_murid, points: 0, nisn: r.nisn };
          }
          studentCounts[key].points += 1;
        });`;
const handleClassReplacement = `const { data: records } = await supabase.from('kasih_ibu').select('nama_murid, nisn, validasi_walikelas, jenis_kebiasaan').eq('kelas', kelas);
      if (records) {
        const studentCounts: Record<string, { nama: string, points: number, nisn: string }> = {};
        records.forEach(r => {
          const key = r.nisn || r.nama_murid;
          if (!studentCounts[key]) {
            studentCounts[key] = { nama: r.nama_murid, points: 0, nisn: r.nisn };
          }
          let pts = 0;
          if (r.jenis_kebiasaan && r.jenis_kebiasaan.startsWith('Tukar Poin')) {
            const match = r.jenis_kebiasaan.match(/\\(-(\\d+)\\)/);
            if (match) pts = -parseInt(match[1]);
          } else if (r.validasi_walikelas === 'Valid') {
            const matchedKey = Object.keys(HABIT_POINTS).find(k => k.toLowerCase() === r.jenis_kebiasaan?.toLowerCase());
            if (matchedKey) pts = HABIT_POINTS[matchedKey].points;
          }
          studentCounts[key].points += pts;
        });`;

if (code.includes(handleClassTarget)) {
    code = code.replace(handleClassTarget, handleClassReplacement);
} else {
    console.log("handleClassTarget not found!");
}

fs.writeFileSync('src/pages/KasihIbuAdmin.tsx', code);
console.log("Patched KasihIbuAdmin.tsx");
