const URL = require('url');
const http = require('http');
const Ws = require('../ws');

class WebSocket extends Ws {
  constructor(url) {
    super();

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
      this.handleSuccess();
    });

    req.on('error', (e) => {
      this.handleError(e);
    });

    req.end();
  }

  handleSuccess() {
    if (this.onopen) {
      return this.onopen();
    }

    return this.emit('open');
  }

  handleError(e) {
    if (this.onerror) {
      return this.onerror(e);
    }

    return super.handleError(e);
  }

  handleGetMessage(data) {
    if (this.onmessage) {
      return this.onmessage(data);
    }

    return super.handleGetMessage(data);
  }

  handleClose() {
    if (this.onclose) {
      return this.onclose();
    }

    return super.handleClose();
  }
}

module.exports = WebSocket;
