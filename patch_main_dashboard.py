with open('src/pages/MainDashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "import { LogOut", 
    "import { AlertTriangle, LogOut"
)

content = content.replace(
    "{ id: 'kedisiplinan', icon: ShieldAlert, label: 'Kedisiplinan', gradient: 'from-red-400 to-red-600', shadow: 'shadow-red-500/40', roles: ['guru', 'tendik'] },",
    "{ id: 'kedisiplinan', icon: ShieldAlert, label: 'Kedisiplinan', gradient: 'from-red-400 to-red-600', shadow: 'shadow-red-500/40', roles: ['guru', 'tendik'] },\n    { id: 'pelanggaran', icon: AlertTriangle, label: 'Pelanggaran', gradient: 'from-rose-400 to-rose-600', shadow: 'shadow-rose-500/40', roles: ['guru', 'tendik'] },"
)

with open('src/pages/MainDashboard.tsx', 'w') as f:
    f.write(content)
print("Patched MainDashboard.tsx")

