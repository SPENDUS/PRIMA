const fs = require('fs');
let code = fs.readFileSync('src/pages/Kedisiplinan.tsx', 'utf-8');

const target = `            </div>
          )}
        </div>
      </main>`;
const replacement = `            </div>
          )}
        </div>
        </div>
      </main>`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/pages/Kedisiplinan.tsx', code);
    console.log("Fixed main close");
} else {
    console.log("Not found main close");
}
