import re

with open('src/pages/TugasGuru.tsx', 'r') as f:
    content = f.read()

target = """  const fetchJadwal = async () => {
    try {
      const res = await fetch(`/api/jadwal-mengajar?namaGuru=${encodeURIComponent(user['Nama Guru'] || user.nama || '')}`);
      const result = await res.json();
      if (result.success) {
        const uniqueMapel = Array.from(new Set(result.data.map((d: any) => d.mapel))).filter(Boolean) as string[];
        const uniqueKelas = Array.from(new Set(result.data.map((d: any) => d.kelas))).filter(Boolean) as string[];
        
        // If the teacher has a 'Mengajar' field (comma separated), add those too
        if (user.Mengajar) {
          const mapels = user.Mengajar.split(',').map((m: string) => m.trim());
          mapels.forEach((m: string) => {
            if (!uniqueMapel.includes(m)) uniqueMapel.push(m);
          });
        }

        setMapelOptions(uniqueMapel);
        setKelasOptions(uniqueKelas);
      }
    } catch (error) {
      console.error("Failed to fetch jadwal", error);
    }
  };"""

replacement = """  const fetchJadwal = async () => {
    try {
      const res = await fetch(`/api/jadwal-mengajar?namaGuru=${encodeURIComponent(user['Nama Guru'] || user.nama || '')}`);
      const result = await res.json();
      if (result.success) {
        const uniqueMapel = Array.from(new Set(result.data.map((d: any) => d.mapel))).filter(Boolean) as string[];
        
        // If the teacher has a 'Mengajar' field (comma separated), add those too
        if (user.Mengajar) {
          const mapels = user.Mengajar.split(',').map((m: string) => m.trim());
          mapels.forEach((m: string) => {
            if (!uniqueMapel.includes(m)) uniqueMapel.push(m);
          });
        }

        setMapelOptions(uniqueMapel);
      }
      
      // Fetch all unique classes from database
      const resKelas = await fetch('/api/kelas');
      const resultKelas = await resKelas.json();
      if (resultKelas.success) {
        setKelasOptions(resultKelas.data);
      }
    } catch (error) {
      console.error("Failed to fetch jadwal", error);
    }
  };"""

if target in content:
    content = content.replace(target, replacement)
    with open('src/pages/TugasGuru.tsx', 'w') as f:
        f.write(content)
    print("Updated TugasGuru.tsx")
else:
    print("Failed to update TugasGuru.tsx")
