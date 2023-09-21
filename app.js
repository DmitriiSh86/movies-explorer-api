require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookies = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { DATA_BASE, PORT } = require('./config');

mongoose.connect(DATA_BASE, {
  useNewUrlParser: true,
});

const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

app.use(helmet());

const router = require('./routes');

// eslint-disable-next-line spaced-comment
app.use(cors({ origin: ['https://dmitrii-movies-explorer.nomoredomainsicu.ru', 'https://api.nomoreparties.co/beatfilm-movies'], credentials: true }));
// eslint-disable-next-line spaced-comment
//app.use(cors({ origin: ['http://localhost:3000', 'https://api.nomoreparties.co/beatfilm-movies'], credentials: true }));

app.use(cookies());
app.use(express.json());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(requestLogger);
app.use(router);
app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT);
