const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!\n');
});

const io = require('../src/server')(server);
let num = 0;

io.on('connection', (socket) => {
  socket.on('message', (data) => {
    console.log(data);
    socket.send(num++);
  });
});

server.listen(12010);
