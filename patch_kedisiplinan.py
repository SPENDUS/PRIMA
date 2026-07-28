import re

with open('src/pages/Kedisiplinan.tsx', 'r') as f:
    content = f.read()

target = """  useEffect(() => {
    const fetchClasses = async () => {
      if (!user?.['Nama Guru']) return;
      try {
        const { data: jadwalData, error } = await supabase
          .from('jadwal_real')
          .select('kelas')
          .eq('guru', user['Nama Guru']);
        
        if (error) throw error;
        
        if (jadwalData) {
          const uniqueClasses = Array.from(new Set(jadwalData.map(j => j.kelas))).sort();
          setAvailableClasses(uniqueClasses);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    fetchClasses();
  }, [user]);"""

replacement = """  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch('/api/kelas');
        const result = await res.json();
        if (result.success) {
          const uniqueClasses = result.data.map((c: string) => c.replace('Kelas ', ''));
          setAvailableClasses(uniqueClasses);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    fetchClasses();
  }, []);"""

if target in content:
    content = content.replace(target, replacement)
    with open('src/pages/Kedisiplinan.tsx', 'w') as f:
        f.write(content)
    print("Updated Kedisiplinan.tsx")
else:
    print("Failed to find target block")

