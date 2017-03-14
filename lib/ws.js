const EventEmitter = require('events');

class Ws extends EventEmitter {
  constructor() {
    super();

    this.socket = null;
  }

  setSocket(socket) {
    this.socket = socket;
    this.proxyEvent(socket);
  }

  proxyEvent(socket) {
    socket.on('data', (data) => {
      this.handleGetMessage(data);
    });

    socket.on('close', () => {
      this.handleClose();
    });

    socket.on('error', (e) => {
      this.handleError(e);
    });
  }

  send(data) {
    this.socket.write(JSON.stringify(data));
  }

  close() {
    try {
      this.socket.end();
    } catch (e) {
      this.handleError(e);
    }
  }

  handleError(e) {
    this.emit('error', e);
  }

  handleGetMessage(data) {
    this.emit('message', JSON.parse(data));
  }

  handleClose() {
    this.emit('close');
  }
}

module.exports = Ws;
