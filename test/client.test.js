const http = require('http');
const should = require('should');
const WebSocket = require('../lib/client');
const ioServer = require('../lib/server');

describe('Client', () => {
  describe('Client test in no server', () => {
    let socket = null;

    beforeEach(() => {
      socket = new WebSocket('ws://127.0.0.1:12010');
    });

    it('onerror function should be executed', (done) => {
      socket.onerror = (e) => {
        done();
      };
    });

    it('error listener should be executed', (done) => {
      socket.on('error', (e) => {
        done();
      });
    });
  });

  after(() => {
    describe('Client test in server', function () {
      const server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hello World!\n');
      });

      const io = ioServer(server);

      server.listen(12010);

      let serverSocket = null;

      io.on('connection', (socket) => {
        serverSocket = socket;
      });

      let socket = null;

      beforeEach(() => {
        socket = new WebSocket('ws://127.0.0.1:12010');
      });

      it('onopen function should be executed', (done) => {
        socket.onopen = function () {
          done();
        };
      });

      it('open listener should be executed', (done) => {
        socket.on('open', () => {
          done();
        });
      });

      it('onmessage function should be executed', (done) => {
        socket.onmessage = () => {
          done();
        };
        setTimeout(() => {
          serverSocket.send('test');
        }, 500);
      });

      it('message listener should be executed', (done) => {
        socket.on('message', () => {
          done();
        });
        setTimeout(() => {
          serverSocket.send('test');
        }, 500);
      });

      it('clinet should get message "test"', (done) => {
        socket.on('message', (msg) => {
          msg.should.equal('test');
          done();
        });
        setTimeout(() => {
          serverSocket.send('test');
        }, 500);
      });
    });
  });
});
