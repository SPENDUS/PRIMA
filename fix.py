with open('src/pages/JadwalMengajar.tsx', 'r') as f:
    content = f.read()

content = content.replace("namaGuru=${encodeURIComponent(user?.['Nama Guru'] || '')}", "namaGuru=${encodeURIComponent(user?.NIP || '')}")
content = content.replace("{item.guru}", "{user?.['Nama Guru'] || item.guru}")

with open('src/pages/JadwalMengajar.tsx', 'w') as f:
    f.write(content)
