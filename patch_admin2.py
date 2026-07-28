import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace('"Sekolah"', '"PRIMA SPENDUS"')

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)

