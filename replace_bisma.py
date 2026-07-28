import os
import re

directories = ['src']
target_word = "BISMA"
replacement_word = "PRIMA SPENDUS"

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
            
            if "bisma_user" in content:
                # keep bisma_user as is, it's an internal key
                content_parts = content.split('bisma_user')
                new_content_parts = []
                for idx, part in enumerate(content_parts):
                    if idx < len(content_parts) - 1:
                        new_content_parts.append(part.replace(target_word, replacement_word) + "bisma_user")
                    else:
                        new_content_parts.append(part.replace(target_word, replacement_word))
                new_content = "".join(new_content_parts)
            else:
                new_content = content.replace(target_word, replacement_word)
                
            if content != new_content:
                with open(filepath, 'w') as f:
                    f.write(new_content)
                print(f"Updated {filepath}")

