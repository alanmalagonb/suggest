"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _helpers = require("../lib/helpers");

var _database = require("../database");

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _path = _interopRequireDefault(require("path"));

var userCtrl = {};

userCtrl.renderUserProfile = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var images, helmavatar, fecha, stadistics, suggestsc, commentsc, replysc, permission, role, priority, key;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _database.pool.query('SELECT images.*,lastlogin.last_con as fecha FROM images INNER JOIN lastlogin ON images.player_id = lastlogin.player_id WHERE images.player_id=?', [req.user.id]);

          case 3:
            images = _context.sent;
            fecha = images[0].fecha;
            stadistics = {
              suggests: 0,
              comments: 0,
              replys: 0
            };
            _context.next = 8;
            return _database.pool.query('SELECT IFNULL(count(*),0) as suggests FROM links where player_id=?', [req.user.id]);

          case 8:
            suggestsc = _context.sent;
            _context.next = 11;
            return _database.pool.query('SELECT IFNULL(count(*),0) as comments FROM comments where player_id=?', [req.user.id]);

          case 11:
            commentsc = _context.sent;
            _context.next = 14;
            return _database.pool.query('SELECT IFNULL(count(*),0) as replys FROM reply where player_id=?', [req.user.id]);

          case 14:
            replysc = _context.sent;
            stadistics.suggests = suggestsc[0].suggests;
            stadistics.comments = commentsc[0].comments;
            stadistics.replys = replysc[0].replys;

            if (!images[0]) {
              _context.next = 22;
              break;
            }

            helmavatar = images[0].filename;
            _context.next = 25;
            break;

          case 22:
            _context.next = 24;
            return (0, _helpers.getAvatar)(req.user.realname);

          case 24:
            helmavatar = _context.sent;

          case 25:
            _context.next = 27;
            return _database.poolp.query('SELECT luckperms_user_permissions.permission FROM luckperms_players, luckperms_user_permissions WHERE luckperms_players.username = ?', [req.user.username]);

          case 27:
            permission = _context.sent;
            role = "<span class=\"badge bg-warning\">Miembro</span>";
            priority = 0;

            for (key in permission) {
              if (permission[key].permission === "group.vip" && priority < 1) {
                role = "<span class=\"badge bg-info\">VIP</span>";
                priority = 1;
              } else if (permission[key].permission === "group.vip+" && priority < 2) {
                role = "<span class=\"badge bg-primary\">VIP+</span>";
                priority = 2;
              } else if (permission[key].permission === "group.admin" && priority < 3) {
                role = "<span class=\"badge bg-danger\">Admin</span>";
                priority = 2;
              }
            }

            res.render('profile', {
              helmavatar: helmavatar,
              stadistics: stadistics,
              role: role,
              fecha: fecha
            });
            _context.next = 38;
            break;

          case 34:
            _context.prev = 34;
            _context.t0 = _context["catch"](0);
            req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
            res.redirect('back');

          case 38:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 34]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

userCtrl.updateImage = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var saveImage;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            try {
              saveImage = /*#__PURE__*/function () {
                var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
                  var imgUrl, query, images, permission, hasPermissionImage, hasPermissionGif, key, imageTempPath, ext, targetPath, filename;
                  return _regenerator["default"].wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          imgUrl = (0, _helpers.randomNumber)();
                          query = '%' + imgUrl + '%';
                          _context2.next = 4;
                          return _database.pool.query('SELECT * FROM images WHERE filename LIKE ?', [query]);

                        case 4:
                          images = _context2.sent;
                          _context2.next = 7;
                          return _database.poolp.query('SELECT luckperms_user_permissions.permission FROM luckperms_players, luckperms_user_permissions WHERE luckperms_players.username = ?', [req.user.username]);

                        case 7:
                          permission = _context2.sent;
                          hasPermissionImage = false;
                          hasPermissionGif = false;

                          for (key in permission) {
                            if (permission[key].permission === "group.vip") {
                              hasPermissionImage = true;
                            }

                            if (permission[key].permission === "group.vip+") {
                              hasPermissionGif = true;
                            }
                          }

                          if (!(images.length > 0)) {
                            _context2.next = 15;
                            break;
                          }

                          saveImage();
                          _context2.next = 46;
                          break;

                        case 15:
                          imageTempPath = req.file.path;
                          ext = _path["default"].extname(req.file.originalname).toLowerCase();
                          targetPath = _path["default"].resolve("./uploads/".concat(imgUrl).concat(ext));

                          if (!(!hasPermissionImage && (ext === ".jpeg" || ext === ".jpg" || ext === ".png"))) {
                            _context2.next = 26;
                            break;
                          }

                          _context2.next = 21;
                          return _fsExtra["default"].unlink(imageTempPath);

                        case 21:
                          req.flash('message', 'Necesitas rango Vip para subir imágenes');
                          res.redirect('/profile');
                          return _context2.abrupt("return");

                        case 26:
                          if (!(!hasPermissionGif && ext === ".gif")) {
                            _context2.next = 32;
                            break;
                          }

                          _context2.next = 29;
                          return _fsExtra["default"].unlink(imageTempPath);

                        case 29:
                          req.flash('message', 'Necesitas rango Vip+ para subir gifs');
                          res.redirect('/profile');
                          return _context2.abrupt("return");

                        case 32:
                          if (!(ext === ".png" || ext === ".jpg" || ext === ".jpeg" || ext === ".gif")) {
                            _context2.next = 42;
                            break;
                          }

                          _context2.next = 35;
                          return _fsExtra["default"].rename(imageTempPath, targetPath);

                        case 35:
                          filename = imgUrl + ext;
                          _context2.next = 38;
                          return _database.pool.query('REPLACE INTO images (player_id,filename,nick) values (?,?,?)', [req.user.id, filename, req.user.realname]);

                        case 38:
                          req.flash('success', 'Imagen actualizada!');
                          res.redirect('/profile');
                          _context2.next = 46;
                          break;

                        case 42:
                          _context2.next = 44;
                          return _fsExtra["default"].unlink(imageTempPath);

                        case 44:
                          req.flash('message', 'Solo se permiten Imagenes/Gifs');
                          res.redirect('/profile');

                        case 46:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2);
                }));

                return function saveImage() {
                  return _ref3.apply(this, arguments);
                };
              }();

              saveImage();
            } catch (error) {
              req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
              res.redirect('back');
            } //const helmavatar = await getAvatar(req.user.realname);
            //res.render('profile', { helmavatar });


          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

module.exports = userCtrl;