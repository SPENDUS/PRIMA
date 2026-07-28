import re

with open('src/pages/MonitoringDashboard.tsx', 'r') as f:
    content = f.read()

target = """          const headerColors: Record<string, string> = {
            '1': 'bg-blue-600',
            '2': 'bg-emerald-600',
            '3': 'bg-rose-600',
            '4': 'bg-orange-600',
            '5': 'bg-purple-600',
            '6': 'bg-indigo-600'
          };"""

replacement = """          const headerColors: Record<string, string> = {
            '1': 'bg-blue-600',
            '2': 'bg-emerald-600',
            '3': 'bg-rose-600',
            '4': 'bg-orange-600',
            '5': 'bg-purple-600',
            '6': 'bg-indigo-600',
            '7': 'bg-blue-600',
            '8': 'bg-emerald-600',
            '9': 'bg-rose-600'
          };"""

if target in content:
    content = content.replace(target, replacement)
    with open('src/pages/MonitoringDashboard.tsx', 'w') as f:
        f.write(content)
    print("Fixed headerColors")
else:
    print("Target not found")
