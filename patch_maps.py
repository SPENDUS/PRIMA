import re

# server.ts
with open('server.ts', 'r') as f:
    content = f.read()

content = content.replace("SDN%20Baujeng%201%20Beji", "SMP%20NEGERI%202%20SUKOREJO")
content = content.replace("https://maps.app.goo.gl/6SZ4yHvr9FMNzdZG9", "https://maps.app.goo.gl/t1ocyu6qGHDPG9Bo6")
content = content.replace("https://maps.app.goo.gl/2HW395tEgruXXhFh7", "https://maps.app.goo.gl/t1ocyu6qGHDPG9Bo6")

with open('server.ts', 'w') as f:
    f.write(content)

# AdminDashboard.tsx
with open('src/pages/AdminDashboard.tsx', 'r') as f:
    admin_content = f.read()

admin_content = admin_content.replace("https://maps.app.goo.gl/6SZ4yHvr9FMNzdZG9", "https://maps.app.goo.gl/t1ocyu6qGHDPG9Bo6")
admin_content = admin_content.replace("https://maps.app.goo.gl/2HW395tEgruXXhFh7", "https://maps.app.goo.gl/t1ocyu6qGHDPG9Bo6")

# The user might have it as '' in AdminDashboard for embed, I'll replace it anyway if there's any.
admin_content = admin_content.replace(
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1419!2d112.735817!3d-7.623635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7c490a2c53f81%3A0xc6ad50bd669ecb9b!2sSDN%20Baujeng%201!5e0!3m2!1sid!2sid!4v1714000000000!5m2!1sid!2sid", 
    "https://maps.google.com/maps?q=SMP%20NEGERI%202%20SUKOREJO&t=&z=15&ie=UTF8&iwloc=&output=embed"
)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(admin_content)

# HelpDeskFloat.tsx
with open('src/components/HelpDeskFloat.tsx', 'r') as f:
    help_content = f.read()

help_content = help_content.replace("https://maps.app.goo.gl/6SZ4yHvr9FMNzdZG9", "https://maps.app.goo.gl/t1ocyu6qGHDPG9Bo6")
help_content = help_content.replace("https://maps.app.goo.gl/2HW395tEgruXXhFh7", "https://maps.app.goo.gl/t1ocyu6qGHDPG9Bo6")
help_content = help_content.replace(
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1419!2d112.735817!3d-7.623635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7c490a2c53f81%3A0xc6ad50bd669ecb9b!2sSDN%20Baujeng%201!5e0!3m2!1sid!2sid!4v1714000000000!5m2!1sid!2sid", 
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15815.793037844984!2d112.7250342!3d-7.7044513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7d100133d12a1%3A0xed6c878664373841!2sSMP%20NEGERI%202%20SUKOREJO!5e0!3m2!1sid!2sid!4v1714000000000!5m2!1sid!2sid"
)

with open('src/components/HelpDeskFloat.tsx', 'w') as f:
    f.write(help_content)

print("Updated maps URLs")

