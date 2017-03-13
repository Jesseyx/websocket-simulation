const EventEmitter = require('events');
const crypto = require('crypto');

const constants = require('../constants');
const Ws = require('../ws');

class Server extends EventEmitter {
  constructor(server) {
    super();

    this.subscribeUpgrade(server);
  }

  subscribeUpgrade(server) {
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

      const ws = new Ws();
      ws.setSocket(socket);

      // 让数据立即发送
      socket.setNoDelay(true);
      socket.write(headers.concat('', '').join('\r\n'));

      this.emit('connection', ws);
    });
  }
}

module.exports = Server;
