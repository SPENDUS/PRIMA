import re

with open('server.ts', 'r') as f:
    content = f.read()

pelanggaran_logic = """
      // Calculate absence in days
      let sakitHari = 0;
      let izinHari = 0;
      let alphaHari = 0;
      let dispensasiHari = 0;
      
      attendanceList.forEach((record: any) => {
        if (record.status === 'Sakit') sakitHari++;
        else if (record.status === 'Izin') izinHari++;
        else if (record.status === 'Alpa' || record.status === 'Tidak Hadir') alphaHari++;
        else if (record.status === 'Dispensasi') dispensasiHari++;
      });

      // Process Pelanggaran / Catatan Kedisiplinan
      const pelanggaranList: any[] = [];
      let totalPoinPelanggaran = 0;

      filteredJournals.forEach(j => {
        if (j.catatan_mengajar && j.catatan_mengajar !== 'Nihil' && j.catatan_mengajar !== '[]') {
          try {
            const parsed = typeof j.catatan_mengajar === 'string' ? JSON.parse(j.catatan_mengajar) : j.catatan_mengajar;
            if (Array.isArray(parsed)) {
              parsed.forEach((d: any) => {
                if ((d.student === studentName || d.murid === studentName) && d.type) {
                  const match = d.type.match(/\\((\\d+)\\s+poin\\)/i);
                  let poin = match ? parseInt(match[1]) : 0;
                  totalPoinPelanggaran += poin;
                  pelanggaranList.push({
                    id: j.id,
                    date: new Date(j.timestamp).toLocaleDateString('id-ID'),
                    type: d.type,
                    poin: poin,
                    mapel: j.mata_pelajaran,
                    guru: j.nama_guru,
                    penanganan: d.penanganan || null
                  });
                }
              });
            }
          } catch (e) { }
        }
      });
"""

content = content.replace(
"""      // Calculate absence in days
      let sakitHari = 0;
      let izinHari = 0;
      let alphaHari = 0;
      let dispensasiHari = 0;
      
      attendanceList.forEach((record: any) => {
        if (record.status === 'Sakit') sakitHari++;
        else if (record.status === 'Izin') izinHari++;
        else if (record.status === 'Alpa' || record.status === 'Tidak Hadir') alphaHari++;
        else if (record.status === 'Dispensasi') dispensasiHari++;
      });""",
pelanggaran_logic
)

content = content.replace(
"""      res.json({ 
        success: true, 
        data: attendanceList,
        summary: {""",
"""      res.json({ 
        success: true, 
        data: attendanceList,
        pelanggaran: pelanggaranList,
        totalPoinPelanggaran,
        summary: {"""
)

with open('server.ts', 'w') as f:
    f.write(content)
