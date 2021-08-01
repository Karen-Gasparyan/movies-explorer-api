// general
const SERVER_ERROR = 'На сервере произошла ошибка';
const NO_RESPONSE = 'Нет ответа на данный запрос';
const NOT_AUTHORIZED = 'Необходима авторизация';
const NOT_AUTHORIZED_INVALID_JWT = 'Необходима авторизация, либо передан неверный JWT';

// movie
const NO_MOVIES = 'В вашей коллекции нет сохраненных фильмов';
const SAVING_ERROR = 'Переданы некорректные данные при сохранении фильма';
const MOVIE_ID_NOT_FOUND = 'Фильм с указанным id не найден';
const NO_AUTHORITY = 'Нет полномочий для удаления данного фильма';

// user
const INVALID_DATA = 'Неправильные почта или пароль';
const SIGNUP_ERROR = 'Переданы некорректные данные при регистрации пользователя';
const UPDATE_ERROR = 'Переданы некорректные данные при обновлении профиля';
const CONFLICT_EMAIL = 'Пользователь с таким email уже зарегистрирован';
const USER_NOT_FOUND = 'Пользователь не найден';
const USER_ID_NOT_FOUND = 'Пользователь с указанным id не найден';

module.exports = {
  SERVER_ERROR,
  NO_RESPONSE,
  NO_MOVIES,
  SAVING_ERROR,
  MOVIE_ID_NOT_FOUND,
  NO_AUTHORITY,
  INVALID_DATA,
  SIGNUP_ERROR,
  UPDATE_ERROR,
  CONFLICT_EMAIL,
  USER_NOT_FOUND,
  USER_ID_NOT_FOUND,
  NOT_AUTHORIZED,
  NOT_AUTHORIZED_INVALID_JWT,
};
