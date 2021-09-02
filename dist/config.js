"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dotenv = require("dotenv");

(0, _dotenv.config)();
var _default = {
  database: {
    connectionLimit: 10,
    host: process.env.DATABASE_HOST_SUGGEST || "localhost",
    user: process.env.DATABASE_USER_SUGGEST || "root",
    password: process.env.DATABASE_PASSWORD_SUGGEST || "oro27Modulado",
    database: process.env.DATABASE_NAME_SUGGEST || "dblinks",
    charset: "utf8mb4"
  },
  authme: {
    connectionLimit: 10,
    host: process.env.DATABASE_HOST_AUTHME || "localhost",
    user: process.env.DATABASE_USER_AUTHME || "root",
    password: process.env.DATABASE_PASSWORD_AUTHME || "oro27Modulado",
    database: process.env.DATABASE_NAME_AUTHME || "authme",
    charset: "utf8mb4"
  },
  luckperms: {
    connectionLimit: 10,
    host: process.env.DATABASE_HOST_LUCKPERMS || "localhost",
    user: process.env.DATABASE_USER_LUCKPERMS || "root",
    password: process.env.DATABASE_PASSWORD_LUCKPERMS || "oro27Modulado",
    database: process.env.DATABASE_NAME_LUCKPERMS || "minecraft",
    charset: "utf8mb4"
  },
  port: process.env.PORT || 4000
};
exports["default"] = _default;