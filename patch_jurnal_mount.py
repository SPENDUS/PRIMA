import re

with open('src/pages/Jurnal.tsx', 'r') as f:
    content = f.read()

target = """      if (preKelas) {
        setKelas(preKelas);
        setIsFromSchedule(true);
      }"""

replacement = """      if (preKelas) {
        setKelas(String(preKelas).toUpperCase().replace('KELAS', '').trim());
        setIsFromSchedule(true);
      }"""

if target in content:
    content = content.replace(target, replacement)
    with open('src/pages/Jurnal.tsx', 'w') as f:
        f.write(content)
    print("Patched preKelas logic")
else:
    print("Target not found")
