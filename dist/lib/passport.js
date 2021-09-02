"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _passport = _interopRequireDefault(require("passport"));

var _moment = _interopRequireDefault(require("moment"));

var _passportLocal = require("passport-local");

var _helpers = require("../lib/helpers");

var _database = require("../database");

var helpers = _interopRequireWildcard(require("./helpers"));

var _expressValidator = require("express-validator");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

_passport["default"].use("local.signin", new _passportLocal.Strategy({
  usernameField: "username",
  passwordField: "password",
  passReqToCallback: true
}, /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, username, password, done) {
    var errors, errorstxt, msg, key, rows, user, validPassword, mysqlTimestamp, hasImage, url;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log(req.body);
            errors = (0, _expressValidator.validationResult)(req);

            if (errors.isEmpty()) {
              _context.next = 9;
              break;
            }

            errorstxt = errors.mapped();
            msg = "";

            for (key in errorstxt) {
              msg += "<p>" + errorstxt[key].msg + " </p> ";
            }

            req.flash('error', msg);
            res.redirect('back');
            return _context.abrupt("return");

          case 9:
            _context.prev = 9;
            _context.next = 12;
            return _database.poola.query("SELECT * FROM authme WHERE realname=?", [username]);

          case 12:
            rows = _context.sent;
            _context.next = 18;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](9);
            return _context.abrupt("return", done(null, false, req.flash("message", "Algo salió mal. Inténtalo de nuevo más tarde.")));

          case 18:
            if (!(rows.length > 0)) {
              _context.next = 49;
              break;
            }

            user = rows[0];
            _context.next = 22;
            return helpers.matchPassword(password, user.password);

          case 22:
            validPassword = _context.sent;

            if (!validPassword) {
              _context.next = 46;
              break;
            }

            _context.prev = 24;
            mysqlTimestamp = (0, _moment["default"])(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            _context.next = 28;
            return _database.pool.query('REPLACE INTO lastlogin (player_id,last_con) values (?,?)', [user.id, mysqlTimestamp]);

          case 28:
            _context.next = 30;
            return _database.pool.query('SELECT * FROM images WHERE player_id=?', [user.id]);

          case 30:
            hasImage = _context.sent;

            if (hasImage[0]) {
              _context.next = 37;
              break;
            }

            _context.next = 34;
            return (0, _helpers.getAvatar)(user.realname);

          case 34:
            url = _context.sent;
            _context.next = 37;
            return _database.pool.query('REPLACE INTO images (player_id,filename,nick) values (?,?,?)', [user.id, url, user.realname]);

          case 37:
            done(null, user, req.flash("success", "Bienvenido " + user.realname));
            _context.next = 44;
            break;

          case 40:
            _context.prev = 40;
            _context.t1 = _context["catch"](24);
            console.log(_context.t1);
            return _context.abrupt("return", done(null, false, req.flash("message", "Algo salió mal. Inténtalo de nuevo más tarde.")));

          case 44:
            _context.next = 47;
            break;

          case 46:
            done(null, false, req.flash("message", "Contraseña Incorrecta!"));

          case 47:
            _context.next = 50;
            break;

          case 49:
            return _context.abrupt("return", done(null, false, req.flash("message", "El Usuario no existe!")));

          case 50:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[9, 15], [24, 40]]);
  }));

  return function (_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}()));

_passport["default"].serializeUser(function (user, done) {
  done(null, user.id);
});

_passport["default"].deserializeUser( /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(id, done) {
    var rows, image;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _database.poola.query("SELECT * FROM authme WHERE id = ?", [id]);

          case 3:
            rows = _context2.sent;
            _context2.next = 6;
            return _database.pool.query("SELECT * FROM images WHERE player_id = ?", [id]);

          case 6:
            image = _context2.sent;
            if (image[0]) Object.assign(rows[0], {
              avatar: image[0].filename
            });
            delete rows[0].password;
            done(null, rows[0]);
            _context2.next = 15;
            break;

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2["catch"](0);
            return _context2.abrupt("return", done(_context2.t0, false));

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 12]]);
  }));

  return function (_x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());