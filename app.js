const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

require('dotenv').config();

const { DB_PROD, NODE_ENV } = process.env;
const { DB_DEV, PORT, limiter } = require('./config');
const { NO_RESPONSE } = require('./constants');

const NotFoundError = require('./errors/not-found-error');
const cors = require('./middlewares/cors');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

app.use(helmet());
app.use(requestLogger);
app.use(limiter);
app.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(`mongodb://localhost:27017/${NODE_ENV === 'production' ? DB_PROD : DB_DEV}`, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

require('./routes/index')(app);

app.use(() => {
  throw new NotFoundError(NO_RESPONSE);
});
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
