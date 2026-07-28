import re

with open('server.ts', 'r') as f:
    content = f.read()

target = """      if (namaGuru) {
        query = query.eq('guru', actualNip);
      }"""
replacement = """      if (namaGuru) {
        query = query.eq('guru', nip || namaGuru);
      }"""

if target in content:
    content = content.replace(target, replacement)
    
with open('server.ts', 'w') as f:
    f.write(content)
