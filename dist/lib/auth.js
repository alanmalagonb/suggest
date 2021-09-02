"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAdmin = exports.isNotLoggedIn = exports.isLoggedIn = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _database = require("../database");

var isLoggedIn = function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/signin");
};

exports.isLoggedIn = isLoggedIn;

var isNotLoggedIn = function isNotLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) return next();
  res.redirect('/profile');
};

exports.isNotLoggedIn = isNotLoggedIn;

var isAdmin = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var user;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _database.pool.query('SELECT * FROM admin where realname = ?', [req.user.realname]);

          case 3:
            user = _context.sent;

            if (!user[0]) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return", next());

          case 6:
            res.redirect('/profile');
            _context.next = 13;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](0);
            req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
            res.redirect('back');

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 9]]);
  }));

  return function isAdmin(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.isAdmin = isAdmin;