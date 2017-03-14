const http = require('http');
const should = require('should');
const WebSocket = require('../src/client');
const ioServer = require('../src/server');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!\n');
});

server.listen(12011);

describe('Server', () => {
  describe('Init the io server', () => {
    it('ioServer\'s parameter must instanceof http.Server', () => {
      ioServer.bind(null, {}).should.throw('Need a server.');
    });
  });

  describe('Test IO Server', () => {
    let io = null,
      serverSocket = null;
      client = null;

    io = ioServer(server);
    // beforeEach(() => {
    //
    // });

    it('connection listener should be executed when a new client want to link', (done) => {
      io.on('connection', (socket) => {
        serverSocket = socket;
        done();
      });

      client = new WebSocket('ws://127.0.0.1:12011');
    });

    it('message listener should be executed when client send message', (done) => {
      serverSocket.once('message', () => {
        done();
      });

      client.send('test');
    });

    it('serverSocket should get message "test"', (done) => {
      serverSocket.once('message', (msg) => {
        msg.should.equal('test');
        done();
      });

      client.send('test');
    });
  });
});
