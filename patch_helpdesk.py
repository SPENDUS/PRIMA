import re

with open('src/components/HelpDeskFloat.tsx', 'r') as f:
    content = f.read()

# Replace email
content = content.replace("akhmadnasor@gmail.com", "spendusjaya@gmail.com")

# Replace SDN Baujeng I Beji with SMPN 2 Sukorejo
content = content.replace("SDN Baujeng I Beji", "SMPN 2 Sukorejo")

# Disable hyperlinks in HelpDeskFloat.tsx
# Target 1: <a href={`https://mail.google.com...
content = re.sub(r'<a href=\{`https://mail\.google\.com[^>]+>', 
                 r'<a href="#" onClick={(e) => e.preventDefault()} className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors text-left group opacity-50 cursor-not-allowed" title="Fitur dinonaktifkan sementara">', 
                 content)

# Target 2: <a href={config.youtube_url} ...
content = re.sub(r'<a href=\{config\.youtube_url\}[^>]+>', 
                 r'<a href="#" onClick={(e) => e.preventDefault()} className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors text-left group opacity-50 cursor-not-allowed" title="Fitur dinonaktifkan sementara">', 
                 content)

# Target 3: <a href={config.ig_url ?? ...
content = re.sub(r'<a href=\{config\.ig_url[^>]+>', 
                 r'<a href="#" onClick={(e) => e.preventDefault()} className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors text-left group opacity-50 cursor-not-allowed" title="Fitur dinonaktifkan sementara">', 
                 content)

# Target 4: <a href={config.web_url ?? ...
content = re.sub(r'<a href=\{config\.web_url[^>]+>', 
                 r'<a href="#" onClick={(e) => e.preventDefault()} className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors text-left group opacity-50 cursor-not-allowed" title="Fitur dinonaktifkan sementara">', 
                 content)

with open('src/components/HelpDeskFloat.tsx', 'w') as f:
    f.write(content)
print("Patched HelpDeskFloat")

