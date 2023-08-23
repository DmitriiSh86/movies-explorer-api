const { JWT_SECRET = 'JWT_SECRET' } = process.env;
const { DATA_BASE = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
const { PORT = 4001 } = process.env;

module.exports = { JWT_SECRET, DATA_BASE, PORT };
