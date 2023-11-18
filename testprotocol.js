const Protocol = require('./protocol');

protocol = new Protocol();

console.log(protocol.parseMessage('JOIN @danny hello world!'));
console.log(protocol.parseMessage('JOIN @danny'));
console.log(protocol.parseMessage('JOIN hello world!'));
console.log(protocol.parseMessage('JOIN@ello world!'));