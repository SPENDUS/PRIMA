import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace("const [bgLogin, setBgLogin] = useState(\"\");", "const [login_background_url, setLoginBackgroundUrl] = useState(\"\");")
content = content.replace("setBgLogin(data.bgLogin || \"\");", "setLoginBackgroundUrl(data.login_background_url || \"\");")
content = content.replace("bgLogin,", "login_background_url,")
content = content.replace("bgLogin ?", "login_background_url ?")
content = content.replace("{bgLogin}", "{login_background_url}")
content = content.replace("value={bgLogin}", "value={login_background_url}")
content = content.replace("setBgLogin(e.target.value)", "setLoginBackgroundUrl(e.target.value)")

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)
