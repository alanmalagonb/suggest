"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFileName = exports.randomNumber = exports.getAvatar = exports.timeagoes = exports.matchPassword = exports.encryptPassword = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _minecraftLookup = _interopRequireDefault(require("minecraft-lookup"));

var _path = _interopRequireDefault(require("path"));

var encryptPassword = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(password) {
    var salt, hash;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _bcryptjs["default"].genSalt(16);

          case 2:
            salt = _context.sent;
            _context.next = 5;
            return _bcryptjs["default"].hash(password, salt);

          case 5:
            hash = _context.sent;
            return _context.abrupt("return", hash);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function encryptPassword(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.encryptPassword = encryptPassword;

var matchPassword = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(password, savedPassword) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _bcryptjs["default"].compare(password, savedPassword);

          case 3:
            return _context2.abrupt("return", _context2.sent);

          case 6:
            _context2.prev = 6;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 6]]);
  }));

  return function matchPassword(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

exports.matchPassword = matchPassword;

var timeagoes = function timeagoes(number, index) {
  return [['justo ahora', 'en un rato'], ['hace %s segundos', 'en %s segundos'], ['hace 1 minuto', 'en 1 minuto'], ['hace %s minutos', 'en %s minutos'], ['hace 1 hora', 'en 1 hora'], ['hace %s horas', 'en %s horas'], ['hace 1 día', 'en 1 día'], ['hace %s días', 'en %s días'], ['hace 1 semana', 'en 1 semana'], ['hace %s semanas', 'en %s semanas'], ['hace 1 mes', 'en 1 mes'], ['hace %s meses', 'en %s meses'], ['hace 1 año', 'en 1 año'], ['hace %s años', 'en %s años']][index];
};

exports.timeagoes = timeagoes;

var getAvatar = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(realname) {
    var _yield$mcapi$head, helmavatar;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return _minecraftLookup["default"].head(realname);

          case 3:
            _yield$mcapi$head = _context3.sent;
            helmavatar = _yield$mcapi$head.helmavatar;
            return _context3.abrupt("return", helmavatar);

          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3["catch"](0);
            console.log(_context3.t0);
            return _context3.abrupt("return", "/img/steve.png");

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 8]]);
  }));

  return function getAvatar(_x4) {
    return _ref3.apply(this, arguments);
  };
}();

exports.getAvatar = getAvatar;

var randomNumber = function randomNumber() {
  var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
  var randomNumber = 0;

  for (var i = 0; i < 6; i++) {
    randomNumber += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return randomNumber;
};

exports.randomNumber = randomNumber;

var getFileName = function getFileName(filename) {
  return filename.replace(_path["default"].extname(filename), "");
};

exports.getFileName = getFileName;