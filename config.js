const rateLimit = require('express-rate-limit');

const PORT = process.env.PORT || 4000;
const IMAGE_REGEX = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?$/i;
const DB_DEV = 'dev-movies-db';
const JWT_DEV = 'dev-secret';

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 100,
  message: {
    message: 'Превышен лимит запросов, пожалуйста, повторите попытку позднее',
  },
});

module.exports = {
  PORT,
  IMAGE_REGEX,
  DB_DEV,
  JWT_DEV,
  limiter,
};
