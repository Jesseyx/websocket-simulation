const WebSocket = require('../src/client');

const socket = new WebSocket('ws://127.0.0.1:12010');

socket.onopen = () => {
  console.log(this);
};

socket.onerror = (e) => {
  console.log(e);
};

console.log(socket.options.hostname);
