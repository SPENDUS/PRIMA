fetch('http://localhost:3000/api/keterlaksanaan')
  .then(r => r.json())
  .then(d => console.log(Object.keys(d.data || {})))
  .catch(console.error);
