import re

with open('src/components/HelpDeskFloat.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'<a href=\{config\.map_link_url\}[^>]+>', 
                 r'<a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors opacity-50 cursor-not-allowed" title="Fitur dinonaktifkan sementara">', 
                 content)

with open('src/components/HelpDeskFloat.tsx', 'w') as f:
    f.write(content)
print("Patched gmaps link")
