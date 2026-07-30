const fs = require('fs');
let code = fs.readFileSync('src/pages/KasihIbuGuru.tsx', 'utf-8');

const target = `                              </>
                              )
                            )}
                          </div>
                        </td>`;
const replacement = `                              </>
                              )}
                            )}
                          </div>
                        </td>`;
if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/pages/KasihIbuGuru.tsx', code);
    console.log("Fixed brace 2");
} else {
    console.log("Target not found");
}
