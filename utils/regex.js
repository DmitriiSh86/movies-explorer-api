const regexUrl = /^(https?:\/\/)?([a-z0-9._~:/?#@!&'()][*+,;=-]+\.)*[a-z0-9._~:/?#@!&'()*+,;=-]+\.[a-z]{2,}\/?([^\s]*)$/;
const regexEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-].[a-zA-Z0-9-.]+$/;

module.exports = { regexUrl, regexEmail };
