import re

with open('server.ts', 'r') as f:
    content = f.read()

new_content = content.replace("BISMA", "PRIMA SPENDUS")

with open('server.ts', 'w') as f:
    f.write(new_content)
    
print("Updated server.ts")

