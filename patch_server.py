import os

replacements = [
    ("SDN Baujeng I Beji", "SMPN 2 Sukorejo"),
    ("UPT SDN Baujeng 1", "SMPN 2 Sukorejo"),
    ("sdnbaujeng1", "smpn2sukorejo"),
    ("SDN Baujeng 1", "SMPN 2 Sukorejo"),
    ("SDN Baujeng", "SMPN 2 Sukorejo"),
    ("akhmadnasor@gmail.com", "spendusjaya@gmail.com")
]

with open('server.ts', 'r') as f:
    content = f.read()

new_content = content
for old, new in replacements:
    new_content = new_content.replace(old, new)
    
if content != new_content:
    with open('server.ts', 'w') as f:
        f.write(new_content)
    print("Patched server.ts")

