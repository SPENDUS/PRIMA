const fs = require('fs');
let code = fs.readFileSync('src/pages/Pelanggaran.tsx', 'utf-8');

const target1 = `  const fetchRekap = async () => {`;
const replacement1 = `  const normalizedWaliKelas = user?.waliKelas ? String(user?.waliKelas).toLowerCase().replace('kelas', '').trim() : '';
  const normalizedSelectedClass = String(kelas).toLowerCase().replace('kelas', '').trim();
  const canEditDelete = user?.role === 'admin' || normalizedWaliKelas === 'bk' || (normalizedWaliKelas && normalizedWaliKelas === normalizedSelectedClass);

  const fetchRekap = async () => {`;

const target2 = `                                     <button onClick={() => {
                                        setEditingItem({ id: r.id, type: r.type, penanganan: r.penanganan === 'Sudah Ditangani' });
                                        setEditDesc(r.type);
                                        setEditPenanganan(r.penanganan === 'Sudah Ditangani');
                                     }} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-lg transition-colors">
                                        <Edit2 className="w-4 h-4" />
                                     </button>
                                     <button onClick={() => handleDelete(r.id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-lg transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                     </button>`;
const replacement2 = `                                     {canEditDelete && (
                                       <>
                                         <button onClick={() => {
                                            setEditingItem({ id: r.id, studentNama: item.nama, type: r.type, penanganan: r.penanganan === 'Sudah Ditangani' });
                                            setEditDesc(r.type);
                                            setEditPenanganan(r.penanganan === 'Sudah Ditangani');
                                         }} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-lg transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                         </button>
                                         <button onClick={() => handleDelete(r.id, item.nama, r.type)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                         </button>
                                       </>
                                     )}`;

code = code.replace(target1, replacement1);
code = code.replace(target2, replacement2);
fs.writeFileSync('src/pages/Pelanggaran.tsx', code);
console.log("Patched UI in Pelanggaran.tsx");
