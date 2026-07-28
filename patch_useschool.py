import re

with open('src/hooks/useSchoolIdentity.ts', 'r') as f:
    content = f.read()

content = content.replace('"Sekolah"', '"PRIMA SPENDUS"')
content = content.replace("schoolName: data.schoolName || \"PRIMA SPENDUS\"", "schoolName: data.schoolName || \"PRIMA SPENDUS\"") # just to be sure it's fully replaced

with open('src/hooks/useSchoolIdentity.ts', 'w') as f:
    f.write(content)

