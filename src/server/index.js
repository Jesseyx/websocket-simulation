const http = require('http');
const crypto = require('crypto');

const constants = require('../constants');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
});

server.on('upgrade', (req, socket) => {
  let key = req.headers['sec-websocket-key'];

  const shasum = crypto.createHash('sha1');
  key = shasum.update(key + constants.GUID).digest('base64');

  const headers = [
    'HTTP/1.1 101 Switching Protocols',
    'Upgrade: websocket',
    'Connection: upgrade',
    'Sec-WebSocket-Accept: ' + key,
  ];

  // 让数据立即发送
  socket.setNoDelay(true);
  socket.write(headers.concat('', '').join('\r\n'));
});

server.listen(12010);
