const jurnalData = [
  {
    kelas: '9B',
    timestamp: '2026-07-29T03:27:53.603428+00:00',
    ketidakhadiran: '[{"type":"Sakit","students":["MUHAMMAD NAUFAL AZZAUHARI ZANIETA"]}]',
    jam_pembelajaran: '5'
  }
];

const startDate = "2026-07-29";
const endDate = "2026-07-29";
const recordsByDate = {};

(jurnalData || []).forEach(record => {
  const altDate = record.timestamp.split('T')[0];
  let recordDate = altDate;
  try {
     recordDate = new Date(record.timestamp).toLocaleDateString('en-CA');
  } catch(e) {}
  
  if (recordDate >= startDate && recordDate <= endDate) {
     if (!recordsByDate[recordDate]) recordsByDate[recordDate] = [];
     recordsByDate[recordDate].push(record);
  }
});
console.log(recordsByDate);
