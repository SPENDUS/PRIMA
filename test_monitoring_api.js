fetch('http://localhost:3000/api/monitoring')
  .then(r => r.json())
  .then(d => {
    if (d.success) {
      console.log('Success! Data sample:');
      console.log('Classes:', d.data.classes);
      console.log('Jadwal count:', d.data.jadwal.length);
      console.log('Stats:', d.data.stats);
    } else {
      console.log('Error:', d.message);
    }
  })
  .catch(console.error);
