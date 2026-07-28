with open('src/components/HelpDeskFloat.tsx', 'r') as f:
    content = f.read()

content = content.replace(r"\'", "'")

with open('src/components/HelpDeskFloat.tsx', 'w') as f:
    f.write(content)
