const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');

require('dotenv').config();

const { PORT } = require('./config');
const { login, createUser } = require('./controllers/users');
const NotFoundError = require('./errors/not-found-error');

const auth = require('./middlewares/auth');
const cors = require('./middlewares/cors');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

app.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(requestLogger);

// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

// DONE!
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().min(5),
    password: Joi.string().required().min(8),
  }),
}), login);

// DONE!
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email().min(5),
    password: Joi.string().required().min(8),
  }),
}), createUser);

// DONE!
app.use(celebrate({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}));

app.use('/', auth, require('./routes/users'));
app.use('/', auth, require('./routes/movies'));

app.use(() => {
  throw new NotFoundError('Нет ответа на данный запрос');
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
