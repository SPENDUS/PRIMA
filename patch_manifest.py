import json

with open('public/manifest.json', 'r') as f:
    data = json.load(f)

data['name'] = 'PRIMA'
data['short_name'] = 'PRIMA'

for icon in data.get('icons', []):
    icon['src'] = 'http://lh3.googleusercontent.com/d/1ezXCs_VCD_9IZwgWKjYT_i-OfXmeTW_I'

with open('public/manifest.json', 'w') as f:
    json.dump(data, f, indent=2)
print("Updated manifest.json")
