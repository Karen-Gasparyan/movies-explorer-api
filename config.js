const PORT = process.env.PORT || 4000;

const IMAGE_REGEX = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?$/i;

const JWT_DEV = 'dev-secret';

module.exports = {
  PORT,
  IMAGE_REGEX,
  JWT_DEV,
};
