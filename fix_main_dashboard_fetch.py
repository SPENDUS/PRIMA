with open('src/pages/MainDashboard.tsx', 'r') as f:
    content = f.read()

target = "fetch(`/api/main-stats?namaGuru=${encodeURIComponent(user.NIP)}&targetJP=${user.TargetJP || 24}`)"
replacement = "fetch(`/api/main-stats?nip=${encodeURIComponent(user.NIP)}&namaGuru=${encodeURIComponent(user['Nama Guru'])}&targetJP=${user.TargetJP || 24}`)"

content = content.replace(target, replacement)

with open('src/pages/MainDashboard.tsx', 'w') as f:
    f.write(content)
