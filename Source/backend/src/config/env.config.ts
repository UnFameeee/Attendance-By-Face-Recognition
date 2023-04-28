// import path from 'path';
// require("dotenv").config({ path: path.join(__dirname, `/../.env.${process.env.NODE_ENV}`) });
// console.log(path.join(__dirname, `/../.env.${process.env.NODE_ENV}`))

require("dotenv").config();

export const env = {
  SERVER_URL: process.env.SERVER_URL,
  CLIENT_URL: process.env.CLIENT_URL,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  SECRET_KEY: process.env.SECRET_KEY,
  REFRESH_KEY: process.env.REFRESH_KEY,
  SECRET_EXPRIED: process.env.SECRET_EXPRIED,
  REFRESH_EXPIRED: process.env.REFRESH_EXPIRED,
  LOG_FORMAT: process.env.LOG_FORMAT,
  LOG_DIR: process.env.LOG_DIR,
}; 