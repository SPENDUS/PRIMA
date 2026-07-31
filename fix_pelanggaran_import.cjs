const fs = require('fs');
let code = fs.readFileSync('src/pages/Pelanggaran.tsx', 'utf-8');

code = code.replace(
    "import React, { useState, useEffect } from 'react';",
    "import React, { useState, useEffect } from 'react';\nimport { useSchoolIdentity } from '../hooks/useSchoolIdentity';"
);
code = code.replace(
    "import { ArrowLeft, Edit2, Trash2, X, Send, CheckCircle2, ClipboardList, PlusCircle, Search } from 'lucide-react';",
    "import { ArrowLeft, Edit2, Trash2, X, Send, CheckCircle2, ClipboardList, PlusCircle, Search, Printer } from 'lucide-react';"
);

fs.writeFileSync('src/pages/Pelanggaran.tsx', code);
console.log("Fixed import");
