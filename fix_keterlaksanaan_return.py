import re

with open('server.ts', 'r') as f:
    content = f.read()

target = """        if (!dataByClass[item.kelas]) dataByClass[item.kelas] = [];
        dataByClass[item.kelas].push({
          ...item,
          isCompleted: !!matchedJurnal,
          materi: matchedJurnal ? matchedJurnal.materi : '-',
          kebersihan: matchedJurnal ? matchedJurnal.kebersihan_kelas : '-'
        });"""

replacement = """        if (!dataByClass[item.kelas]) dataByClass[item.kelas] = [];
        dataByClass[item.kelas].push({
          ...item,
          guru: guruName,
          isCompleted: !!matchedJurnal,
          materi: matchedJurnal ? matchedJurnal.materi : '-',
          kebersihan: matchedJurnal ? matchedJurnal.kebersihan_kelas : '-'
        });"""

if target in content:
    content = content.replace(target, replacement)
    with open('server.ts', 'w') as f:
        f.write(content)
    print("Fixed keterlaksanaan API return")
else:
    print("Target not found")
