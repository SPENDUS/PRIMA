const fs = require('fs');
let code = fs.readFileSync('src/pages/KasihIbuGuru.tsx', 'utf-8');

const target = `                              canValidate && (
                              <>
                                <button `;
const replacement = `                              {canValidate && (
                              <>
                                <button `;
if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/pages/KasihIbuGuru.tsx', code);
    console.log("Fixed brace");
}
