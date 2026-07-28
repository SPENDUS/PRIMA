with open('src/pages/MainDashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace("fetch(`/api/main-stats?namaGuru=${encodeURIComponent(user['Nama Guru'])}&targetJP=${user.TargetJP || 24}`)", "fetch(`/api/main-stats?namaGuru=${encodeURIComponent(user.NIP)}&targetJP=${user.TargetJP || 24}`)")

with open('src/pages/MainDashboard.tsx', 'w') as f:
    f.write(content)
