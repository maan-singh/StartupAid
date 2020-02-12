// keys.js - figure out what set of keys to return
if (process.env.NODE_ENV === 'production') {
  // we in prod - return prod set of keys
  module.exports = require('./prod');
} else {
  // we are in dev - return dev set
  module.exports = require('./dev');
}
