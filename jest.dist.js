const config = require('./jest.config.js');

module.exports = Object.assign({}, config, {
  transformIgnorePatterns: ['dist', 'node_modules'],
});
