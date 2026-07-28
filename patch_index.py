import re

with open('index.html', 'r') as f:
    content = f.read()

# Replace favicon
favicon_tag = '<link rel="icon" href="http://lh3.googleusercontent.com/d/1ezXCs_VCD_9IZwgWKjYT_i-OfXmeTW_I" />'
if '<link rel="icon"' in content:
    content = re.sub(r'<link[^>]*rel="icon"[^>]*>', favicon_tag, content)
else:
    # insert before <title>
    content = content.replace('<title>', f'{favicon_tag}\n    <title>')

# Change title if requested, the user said "nama aplikasi dari bisma ganti menjadi PRIMA".
# I'll just change the title from "PRIMA SPENDUS" to "PRIMA" if it's there.
content = content.replace('<title>PRIMA SPENDUS</title>', '<title>PRIMA</title>')
content = content.replace('<title>BISMA</title>', '<title>PRIMA</title>')

with open('index.html', 'w') as f:
    f.write(content)
print("Updated index.html")
