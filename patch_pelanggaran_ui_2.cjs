const fs = require('fs');
let code = fs.readFileSync('src/pages/Pelanggaran.tsx', 'utf-8');

const target = `                                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                                     <button onClick={() => handleEditClick(r)} className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 rounded-lg transition-colors">
                                        <Edit2 className="w-4 h-4" />
                                     </button>
                                     <button onClick={() => handleDelete(r.id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-lg transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                     </button>
                                  </td>`;
const replacement = `                                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                                     {canEditDelete && (
                                       <>
                                         <button onClick={() => {
                                            const augmentedR = { ...r, studentNama: item.nama };
                                            handleEditClick(augmentedR);
                                         }} className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 rounded-lg transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                         </button>
                                         <button onClick={() => handleDelete(r.id, item.nama, r.type)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                         </button>
                                       </>
                                     )}
                                  </td>`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/pages/Pelanggaran.tsx', code);
    console.log("Patched UI in Pelanggaran.tsx 2");
} else {
    console.log("Target not found 2");
}
