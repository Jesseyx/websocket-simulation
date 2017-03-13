const http = require('http');
const Server = require('./Server');

function io(server) {
  if ((typeof server === 'undefined') || !(server instanceof http.Server)) {
    throw new Error('Need a server.');
  }

  return new Server(server);
}

module.exports = io;
