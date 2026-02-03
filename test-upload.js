const fs = require('fs');
const http = require('http');

const filePath = 'c:\\Users\\srina\\Downloads\\new murukulu.pdf';
const fileBuffer = fs.readFileSync(filePath);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/pdf',
    'Content-Length': fileBuffer.length
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Response status:', res.statusCode);
    try {
      const json = JSON.parse(data);
      console.log(JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('Raw response:', data);
    }
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error('Error:', e);
  process.exit(1);
});

req.write(fileBuffer);
req.end();

setTimeout(() => {
  console.error('Timeout - no response after 10 seconds');
  process.exit(1);
}, 10000);
