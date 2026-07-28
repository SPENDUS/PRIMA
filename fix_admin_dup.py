import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace("            setLoginBackgroundUrl(data.login_background_url || \"\");\n          setLoginBackgroundUrl(data.login_background_url || \"\");", "            setLoginBackgroundUrl(data.login_background_url || \"\");")

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)
