import re

with open('server.ts', 'r') as f:
    content = f.read()

target = """  app.get('/api/main-stats', async (req, res) => {
    const { namaGuru } = req.query;"""

replacement = """  app.get('/api/main-stats', async (req, res) => {
    const { namaGuru, nip } = req.query;
    const actualNip = nip || namaGuru; // namaGuru was previously used for name, now it might be NIP
    
    // Fetch actual name from nip
    let actualName = namaGuru;
    if (actualNip) {
       const { data: g } = await supabase.from('guru').select('nama_guru').eq('nip', actualNip).single();
       if (g) actualName = g.nama_guru;
    }"""

if target in content:
    content = content.replace(target, replacement)
    
    content = content.replace("eq('guru', namaGuru)", "eq('guru', actualNip)")
    content = content.replace("eq('nama_guru', namaGuru)", "eq('nama_guru', actualName)")
    
    with open('server.ts', 'w') as f:
        f.write(content)
    print("Fixed main-stats!")
else:
    print("Target not found!")
