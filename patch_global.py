import os

replacements = [
    ("SDN Baujeng I Beji", "SMPN 2 Sukorejo"),
    ("UPT SDN Baujeng 1", "SMPN 2 Sukorejo"),
    ("sdnbaujeng1", "smpn2sukorejo"), # for emails / urls if any
    ("SDN Baujeng 1", "SMPN 2 Sukorejo"),
    ("SDN Baujeng", "SMPN 2 Sukorejo"),
    ("akhmadnasor@gmail.com", "spendusjaya@gmail.com")
]

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
            
            new_content = content
            for old, new in replacements:
                new_content = new_content.replace(old, new)
                
            if content != new_content:
                with open(filepath, 'w') as f:
                    f.write(new_content)
                print(f"Patched {filepath}")

