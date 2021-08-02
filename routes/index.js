const auth = require('../middlewares/auth');

const signin = require('./signin');
const signup = require('./signup');
const users = require('./users');
const movies = require('./movies');

module.exports = function (app) {
  app.use(signin);
  app.use(signup);
  app.use('/', auth, users);
  app.use('/', auth, movies);
};
