const fs = require('fs');
let code = fs.readFileSync('src/components/PointRewardCard.tsx', 'utf-8');

// 1. Add import
if (!code.includes("import { HABIT_POINTS }")) {
  code = code.replace(
    `import { Award, Trophy, Star } from 'lucide-react';`,
    `import { Award, Trophy, Star } from 'lucide-react';\nimport { HABIT_POINTS } from '../utils/habitPoints';`
  );
  // Remove local HABIT_POINTS
  code = code.replace(/const HABIT_POINTS: Record<string, \{ points: number, icon: string \}> = \{[\s\S]*?\};\n/, '');
}

// 2. Change select query
const selectTarget = `.select('nisn, jenis_kebiasaan, timestamp')`;
const selectReplacement = `.select('nisn, jenis_kebiasaan, timestamp, validasi_walikelas')`;
code = code.replace(selectTarget, selectReplacement);

// 3. Change points calculation loop
const loopTarget = `data?.forEach(entry => {
          let points = 0;`;
const loopReplacement = `data?.forEach(entry => {
          if (entry.validasi_walikelas !== 'Valid' && !entry.jenis_kebiasaan?.startsWith('Tukar Poin')) return;
          let points = 0;`;
code = code.replace(loopTarget, loopReplacement);

fs.writeFileSync('src/components/PointRewardCard.tsx', code);
console.log("Patched PointRewardCard.tsx");
