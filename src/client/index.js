const EventEmitter = require('events');
const URL = require('url');
const http = require('http');

class WebSocket extends EventEmitter {
  constructor(url) {
    super();

    this.socket = null;
    this.options = WebSocket.parseUrl(url);

    this.connect();
  }

  static parseUrl(url) {
    const options = URL.parse(url);
    if (!options.protocolVersion) {
      options.protocolVersion = 13;
    }
    return options;
  }

  connect() {
    const key = new Buffer(this.options.protocolVersion + '-' + Date.now()).toString('base64');

    const options = {
      port: this.options.port,
      host: this.options.hostname,
      headers: {
        Connection: 'Upgrade',
        Upgrade: 'websocket',
        'Sec-WebSocket-Version': this.options.protocolVersion,
        'Sec-Websocket-key': key,
      },
    };

    const req = http.request(options);

    req.on('upgrade', (res, socket, upgradeHead) => {
      // link success
      this.setSocket(socket);
      this.handleSuccess(socket);
    });

    req.on('error', (e) => {
      this.handleError(e);
    });

    req.end();
  }

  setSocket(socket) {
    this.socket = socket;
  }

  send(data) {
    this.socket.write(data);
  }

  handleSuccess(socket) {
    this.emit('open');
    if (this.onopen) {
      this.onopen();
    }

    socket.on('data', (data) => {
      this.handleGetMessage(data);
    });

    socket.on('close', () => {
      this.handleClose();
    });
  }

  handleError(e) {
    if (this.onerror) {
      return this.onerror(e);
    }
    this.emit('error', e);
  }

  handleGetMessage(data) {
    this.emit('message', data);
    if (this.onmessage) {
      this.onmessage(data);
    }
  }

  handleClose() {
    this.emit('close');
    if (this.onclose) {
      this.onclose();
    }
  }
}

module.exports = WebSocket;
