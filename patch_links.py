import re

# 1. Update HelpDeskFloat.tsx
with open('src/components/HelpDeskFloat.tsx', 'r') as f:
    content = f.read()

# Update configs
content = content.replace("ig_url: 'https://www.instagram.com/smpn2sukorejo/'", "ig_url: 'https://www.instagram.com/smpnegeri2sukorejo?igsh=ZzZ0cjRtc2J6cHB6'")
content = content.replace("web_url: 'https://www.smpn2sukorejo.sch.id/'", "web_url: 'http://www.smpn2sukorejo.sch.id/'")
content = content.replace("map_link_url: 'https://maps.app.goo.gl/6SZ4yHvr9FMNzdZG9'", "map_link_url: 'https://maps.app.goo.gl/2HW395tEgruXXhFh7'")
content = content.replace("ig_url ?? 'https://www.instagram.com/smpn2sukorejo/'", "ig_url ?? 'https://www.instagram.com/smpnegeri2sukorejo?igsh=ZzZ0cjRtc2J6cHB6'")
content = content.replace("web_url ?? 'https://www.smpn2sukorejo.sch.id/'", "web_url ?? 'http://www.smpn2sukorejo.sch.id/'")

# Enable email link
content = re.sub(
    r'<a href="#" onClick=\{\(e\) => e\.preventDefault\(\)\} className="([^"]+)" title="Fitur dinonaktifkan sementara">\s*<div className="([^"]+) text-blue-600',
    r'<a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(config.email)}&su=${encodeURIComponent(\'Konfirmasi PRIMA SPENDUS\')}`} target="_top" rel="noopener noreferrer" className="\1">\n                  <div className="\2 text-blue-600',
    content
)
# Enable youtube link
content = re.sub(
    r'<a href="#" onClick=\{\(e\) => e\.preventDefault\(\)\} className="([^"]+)" title="Fitur dinonaktifkan sementara">\s*<div className="([^"]+) text-red-600',
    r'<a href={config.youtube_url} target="_blank" rel="noreferrer" className="\1">\n                  <div className="\2 text-red-600',
    content
)
# Enable instagram link
content = re.sub(
    r'<a href="#" onClick=\{\(e\) => e\.preventDefault\(\)\} className="([^"]+)" title="Fitur dinonaktifkan sementara">\s*<div className="([^"]+) text-pink-600',
    r'<a href={config.ig_url ?? \'https://www.instagram.com/smpnegeri2sukorejo?igsh=ZzZ0cjRtc2J6cHB6\'} target="_blank" rel="noreferrer" className="\1">\n                  <div className="\2 text-pink-600',
    content
)
# Enable website link
content = re.sub(
    r'<a href="#" onClick=\{\(e\) => e\.preventDefault\(\)\} className="([^"]+)" title="Fitur dinonaktifkan sementara">\s*<div className="([^"]+) text-emerald-600',
    r'<a href={config.web_url ?? \'http://www.smpn2sukorejo.sch.id/\'} target="_blank" rel="noreferrer" className="\1">\n                  <div className="\2 text-emerald-600',
    content
)
# Enable maps link
content = re.sub(
    r'<a href="#" onClick=\{\(e\) => e\.preventDefault\(\)\} className="([^"]+)" title="Fitur dinonaktifkan sementara">\s*<Globe',
    r'<a href={config.map_link_url} target="_blank" rel="noopener noreferrer" className="\1">\n                    <Globe',
    content
)

content = content.replace(" opacity-50 cursor-not-allowed", "")

with open('src/components/HelpDeskFloat.tsx', 'w') as f:
    f.write(content)

# 2. Update AdminDashboard.tsx
with open('src/pages/AdminDashboard.tsx', 'r') as f:
    admin_content = f.read()

admin_content = admin_content.replace("ig_url: 'https://www.instagram.com/smpn2sukorejo/'", "ig_url: 'https://www.instagram.com/smpnegeri2sukorejo?igsh=ZzZ0cjRtc2J6cHB6'")
admin_content = admin_content.replace("web_url: 'https://www.smpn2sukorejo.sch.id/'", "web_url: 'http://www.smpn2sukorejo.sch.id/'")
admin_content = admin_content.replace("map_link_url: 'https://maps.app.goo.gl/6SZ4yHvr9FMNzdZG9'", "map_link_url: 'https://maps.app.goo.gl/2HW395tEgruXXhFh7'")
admin_content = admin_content.replace("ig_url: resData.data.ig_url ?? 'https://www.instagram.com/smpn2sukorejo/'", "ig_url: resData.data.ig_url ?? 'https://www.instagram.com/smpnegeri2sukorejo?igsh=ZzZ0cjRtc2J6cHB6'")
admin_content = admin_content.replace("web_url: resData.data.web_url ?? 'https://www.smpn2sukorejo.sch.id/'", "web_url: resData.data.web_url ?? 'http://www.smpn2sukorejo.sch.id/'")
admin_content = admin_content.replace("ig_url: parsed.ig_url ?? 'https://www.instagram.com/smpn2sukorejo/'", "ig_url: parsed.ig_url ?? 'https://www.instagram.com/smpnegeri2sukorejo?igsh=ZzZ0cjRtc2J6cHB6'")
admin_content = admin_content.replace("web_url: parsed.web_url ?? 'https://www.smpn2sukorejo.sch.id/'", "web_url: parsed.web_url ?? 'http://www.smpn2sukorejo.sch.id/'")
admin_content = admin_content.replace('placeholder="https://www.smpn2sukorejo.sch.id/"', 'placeholder="http://www.smpn2sukorejo.sch.id/"')

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(admin_content)

print("Patched configs and links")
