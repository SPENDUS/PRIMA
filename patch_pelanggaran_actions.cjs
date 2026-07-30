const fs = require('fs');
let code = fs.readFileSync('src/pages/Pelanggaran.tsx', 'utf-8');

const target1 = `  const handleDelete = async (id: number) => {
    if (!window.confirm('Yakin ingin menghapus pelanggaran ini?')) return;
    try {
      const res = await fetch(\`/api/pelanggaran/\${id}\`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchRekap();
      } else {
        alert('Gagal menghapus');
      }
    } catch (e) {
      alert('Terjadi kesalahan');
    }
  };`;
const replacement1 = `  const handleDelete = async (id: number, student: string, type: string) => {
    if (!window.confirm('Yakin ingin menghapus pelanggaran ini?')) return;
    try {
      const res = await fetch(\`/api/pelanggaran/\${id}/item\`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student, type })
      });
      const data = await res.json();
      if (data.success) {
        fetchRekap();
      } else {
        alert('Gagal menghapus');
      }
    } catch (e) {
      alert('Terjadi kesalahan');
    }
  };`;

const target2 = `  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      const res = await fetch(\`/api/pelanggaran/\${editingItem.id}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: editDesc,
          penanganan: editPenanganan ? 'Sudah Ditangani' : null
        })
      });`;
const replacement2 = `  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      const res = await fetch(\`/api/pelanggaran/\${editingItem.id}/item\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student: editingItem.studentNama,
          oldType: editingItem.type,
          newType: editDesc,
          penanganan: editPenanganan ? 'Sudah Ditangani' : null
        })
      });`;

code = code.replace(target1, replacement1);
code = code.replace(target2, replacement2);
fs.writeFileSync('src/pages/Pelanggaran.tsx', code);
console.log("Patched actions in Pelanggaran.tsx");
