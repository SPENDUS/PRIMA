const http = require('http');

http.get('http://localhost:3000/api/jadwal?hari=Senin&kelas=Kelas%201', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data));
});
