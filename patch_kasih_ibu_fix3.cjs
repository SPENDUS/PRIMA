const fs = require('fs');
let code = fs.readFileSync('src/pages/KasihIbuGuru.tsx', 'utf-8');

const target = `                            ) : (
                              {canValidate && (
                              <>`;
const replacement = `                            ) : canValidate ? (
                              <>`;

const targetEnd = `                              </>
                              )}
                            )}
                          </div>
                        </td>`;
const replacementEnd = `                              </>
                              ) : null}
                          </div>
                        </td>`;

if (code.includes(target) && code.includes(targetEnd)) {
    code = code.replace(target, replacement);
    code = code.replace(targetEnd, replacementEnd);
    fs.writeFileSync('src/pages/KasihIbuGuru.tsx', code);
    console.log("Fixed syntax KasihIbuGuru correctly");
} else {
    console.log("Target not found 3 correctly");
}
