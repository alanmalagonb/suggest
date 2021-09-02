"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dislikeReply = exports.likeReply = exports.dislikeComment = exports.likeComment = exports.dislikeSuggest = exports.likeSuggest = exports.deleteReply = exports.deleteComment = exports.deleteLink = exports.renderDetailedLink = exports.renderLinksByStatus = exports.renderMyLinks = exports.renderLinksByPage = exports.updateReplyComment = exports.updateComment = exports.replyComment = exports.addComment = exports.addLink = exports.renderAddLink = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _database = require("../database");

var _helpers = require("../lib/helpers");

var _expressValidator = require("express-validator");

var emojiRegex = require('emoji-regex/es2015/index.js');

var renderAddLink = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var permission, hasPermission, key;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _database.poolp.query('SELECT luckperms_user_permissions.permission FROM luckperms_players, luckperms_user_permissions WHERE luckperms_players.username = ?', [req.user.username]);

          case 3:
            permission = _context.sent;
            hasPermission = false;
            _context.t0 = _regenerator["default"].keys(permission);

          case 6:
            if ((_context.t1 = _context.t0()).done) {
              _context.next = 13;
              break;
            }

            key = _context.t1.value;

            if (!(permission[key].permission === "group.vip" || permission[key].permission === "group.vip+")) {
              _context.next = 11;
              break;
            }

            hasPermission = true;
            return _context.abrupt("break", 13);

          case 11:
            _context.next = 6;
            break;

          case 13:
            res.render("links/add", {
              hasPermission: hasPermission
            });
            _context.next = 20;
            break;

          case 16:
            _context.prev = 16;
            _context.t2 = _context["catch"](0);
            req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
            res.redirect('/links/add');

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 16]]);
  }));

  return function renderAddLink(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.renderAddLink = renderAddLink;

var addLink = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var errors, errorstxt, msg, key, _req$body, title, description, permission, hasPermission, regex, match, newLink;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            errors = (0, _expressValidator.validationResult)(req);

            if (errors.isEmpty()) {
              _context2.next = 8;
              break;
            }

            errorstxt = errors.mapped();
            msg = "";

            for (key in errorstxt) {
              msg += "<p>" + errorstxt[key].msg + " </p> ";
            }

            req.flash('error', msg);
            res.redirect('/links/add');
            return _context2.abrupt("return");

          case 8:
            _context2.prev = 8;
            _req$body = req.body, title = _req$body.title, description = _req$body.description;
            _context2.next = 12;
            return _database.poolp.query('SELECT luckperms_user_permissions.permission FROM luckperms_players, luckperms_user_permissions WHERE luckperms_players.username = ?', [req.user.username]);

          case 12:
            permission = _context2.sent;
            hasPermission = false;
            _context2.t0 = _regenerator["default"].keys(permission);

          case 15:
            if ((_context2.t1 = _context2.t0()).done) {
              _context2.next = 22;
              break;
            }

            key = _context2.t1.value;

            if (!(permission[key].permission === "group.vip" || permission[key].permission === "group.vip+")) {
              _context2.next = 20;
              break;
            }

            hasPermission = true;
            return _context2.abrupt("break", 22);

          case 20:
            _context2.next = 15;
            break;

          case 22:
            regex = emojiRegex();
            match = regex.exec(description) || false;
            newLink = {
              title: title,
              body: description.toString(),
              player_id: req.user.id,
              status_id: 1
            };

            if (!(match && !hasPermission)) {
              _context2.next = 30;
              break;
            }

            req.flash('message', 'Debes ser Vip/Vip+ para usar emojis');
            res.redirect('/links/add');
            _context2.next = 34;
            break;

          case 30:
            _context2.next = 32;
            return _database.pool.query('INSERT INTO links set ?', [newLink]);

          case 32:
            req.flash('success', 'Sugerencia añadida correctamente!');
            res.redirect('/links/pag/1');

          case 34:
            _context2.next = 40;
            break;

          case 36:
            _context2.prev = 36;
            _context2.t2 = _context2["catch"](8);
            req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
            res.redirect('/links/pag/1');

          case 40:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[8, 36]]);
  }));

  return function addLink(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.addLink = addLink;

var addComment = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var errors, errorstxt, msg, key, id, comment, newComment, idExists;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            errors = (0, _expressValidator.validationResult)(req);

            if (errors.isEmpty()) {
              _context3.next = 8;
              break;
            }

            errorstxt = errors.mapped();
            msg = "";

            for (key in errorstxt) {
              msg += "<p>" + errorstxt[key].msg + " </p> ";
            }

            req.flash('error', msg);
            res.redirect('back');
            return _context3.abrupt("return");

          case 8:
            id = req.params.id;
            comment = req.body.comment;
            newComment = {
              text: comment,
              links_id: id,
              player_id: req.user.id
            };
            _context3.prev = 11;
            _context3.next = 14;
            return _database.pool.query('SELECT * FROM links WHERE id=?', [id]);

          case 14:
            idExists = _context3.sent;

            if (idExists[0]) {
              _context3.next = 19;
              break;
            }

            req.flash('error', 'Algo salió mal. Inténtalo de nuevo más tarde.');
            res.redirect('back');
            return _context3.abrupt("return");

          case 19:
            _context3.next = 21;
            return _database.pool.query('INSERT INTO comments set ?', [newComment]);

          case 21:
            req.flash('success', 'Comentario añadido');
            res.redirect('/links/detail/' + id);
            _context3.next = 29;
            break;

          case 25:
            _context3.prev = 25;
            _context3.t0 = _context3["catch"](11);
            req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
            res.redirect('/links/detail/' + id);

          case 29:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[11, 25]]);
  }));

  return function addComment(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

exports.addComment = addComment;

var replyComment = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var errors, errorstxt, msg, key, _req$params, id, idr, reply, newReply, idExists;

    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            errors = (0, _expressValidator.validationResult)(req);

            if (errors.isEmpty()) {
              _context4.next = 8;
              break;
            }

            errorstxt = errors.mapped();
            msg = "";

            for (key in errorstxt) {
              msg += "<p>" + errorstxt[key].msg + " </p> ";
            }

            req.flash('error', msg);
            res.redirect('back');
            return _context4.abrupt("return");

          case 8:
            _req$params = req.params, id = _req$params.id, idr = _req$params.idr;
            reply = req.body.reply;
            newReply = {
              text: reply,
              comment_id: id,
              player_id: req.user.id,
              reply_id: idr
            };
            _context4.prev = 11;
            _context4.next = 14;
            return _database.pool.query('SELECT * FROM comments WHERE id=?', [id]);

          case 14:
            idExists = _context4.sent;

            if (idExists[0]) {
              _context4.next = 19;
              break;
            }

            req.flash('error', 'Algo salió mal. Inténtalo de nuevo más tarde.');
            res.redirect('back');
            return _context4.abrupt("return");

          case 19:
            _context4.next = 21;
            return _database.pool.query('INSERT INTO reply set ?', [newReply]);

          case 21:
            req.flash('success', 'Comentario añadido');
            res.redirect('back');
            _context4.next = 30;
            break;

          case 25:
            _context4.prev = 25;
            _context4.t0 = _context4["catch"](11);
            console.log(_context4.t0);
            req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
            res.redirect('back');

          case 30:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[11, 25]]);
  }));

  return function replyComment(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

exports.replyComment = replyComment;

var updateComment = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var errors, errorstxt, msg, key, id, text, idExists;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            errors = (0, _expressValidator.validationResult)(req);
            console.log(errors);

            if (errors.isEmpty()) {
              _context5.next = 9;
              break;
            }

            errorstxt = errors.mapped();
            msg = "";

            for (key in errorstxt) {
              msg += "<p>" + errorstxt[key].msg + " </p> ";
            }

            req.flash('error', msg);
            res.redirect('back');
            return _context5.abrupt("return");

          case 9:
            id = req.params.id;
            text = req.body.text;
            _context5.prev = 11;
            _context5.next = 14;
            return _database.pool.query('SELECT * FROM comments WHERE id=?', [id]);

          case 14:
            idExists = _context5.sent;

            if (!(!idExists[0] || idExists[0].player_id != req.user.id)) {
              _context5.next = 19;
              break;
            }

            req.flash('error', 'Algo salió mal. Inténtalo de nuevo más tarde.');
            res.redirect('back');
            return _context5.abrupt("return");

          case 19:
            _context5.next = 21;
            return _database.pool.query('UPDATE comments SET text=? WHERE id=?', [text, id]);

          case 21:
            req.flash('success', 'Comentario actualizado');
            res.redirect('back');
            _context5.next = 29;
            break;

          case 25:
            _context5.prev = 25;
            _context5.t0 = _context5["catch"](11);
            req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
            res.redirect('back');

          case 29:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[11, 25]]);
  }));

  return function updateComment(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

exports.updateComment = updateComment;

var updateReplyComment = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var errors, errorstxt, msg, key, id, text, idExists;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            errors = (0, _expressValidator.validationResult)(req);
            console.log(errors);

            if (errors.isEmpty()) {
              _context6.next = 9;
              break;
            }

            errorstxt = errors.mapped();
            msg = "";

            for (key in errorstxt) {
              msg += "<p>" + errorstxt[key].msg + " </p> ";
            }

            req.flash('error', msg);
            res.redirect('back');
            return _context6.abrupt("return");

          case 9:
            id = req.params.id;
            text = req.body.text;
            _context6.prev = 11;
            _context6.next = 14;
            return _database.pool.query('SELECT * FROM reply WHERE id=?', [id]);

          case 14:
            idExists = _context6.sent;

            if (!(!idExists[0] || idExists[0].player_id != req.user.id)) {
              _context6.next = 19;
              break;
            }

            req.flash('error', 'Algo salió mal. Inténtalo de nuevo más tarde.');
            res.redirect('back');
            return _context6.abrupt("return");

          case 19:
            _context6.next = 21;
            return _database.pool.query('UPDATE reply SET text=? WHERE id=?', [text, id]);

          case 21:
            req.flash('success', 'Comentario actualizado');
            res.redirect('back');
            _context6.next = 29;
            break;

          case 25:
            _context6.prev = 25;
            _context6.t0 = _context6["catch"](11);
            req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
            res.redirect('back');

          case 29:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[11, 25]]);
  }));

  return function updateReplyComment(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

exports.updateReplyComment = updateReplyComment;

var renderLinksByPage = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res) {
    var errors, errorstxt, msg, key, id, page, numPerPage, skip, limit, rows, numRows, numPages, _links, suggest, realname, progress, _progress$, plikes, pdislikes, totalProgress, progressBar, pagination, nextp;

    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            errors = (0, _expressValidator.validationResult)(req);

            if (errors.isEmpty()) {
              _context7.next = 9;
              break;
            }

            errorstxt = errors.mapped();
            msg = "";

            for (key in errorstxt) {
              msg += "<p>" + errorstxt[key].msg + " </p> ";
            }

            req.flash('error', msg);
            res.redirect('back');
            return _context7.abrupt("return");

          case 9:
            id = req.params.id;
            page = id;
            numPerPage = 10;
            skip = (Number(page) - 1) * numPerPage;
            limit = skip + ',' + numPerPage;
            _context7.next = 16;
            return _database.pool.query('SELECT count(*) as numRows FROM links');

          case 16:
            rows = _context7.sent;
            numRows = rows[0].numRows;
            numPages = Math.ceil(numRows / numPerPage);
            _context7.next = 21;
            return _database.pool.query('SELECT links.*, images.filename AS image,lastlogin.last_con FROM links LEFT JOIN images ON links.player_id=images.player_id LEFT JOIN lastlogin ON links.player_id=lastlogin.player_id LIMIT ' + limit);

          case 21:
            _links = _context7.sent;

            if (!(!_links[0] && page != 1)) {
              _context7.next = 26;
              break;
            }

            req.flash('message', 'La página no existe.');
            res.redirect('back');
            return _context7.abrupt("return");

          case 26:
            _context7.t0 = _regenerator["default"].keys(_links);

          case 27:
            if ((_context7.t1 = _context7.t0()).done) {
              _context7.next = 43;
              break;
            }

            suggest = _context7.t1.value;
            _context7.next = 31;
            return _database.poola.query('SELECT realname FROM authme WHERE id=?', [_links[suggest].player_id]);

          case 31:
            realname = _context7.sent;
            Object.assign(_links[suggest], {
              nick: realname[0].realname
            });
            _context7.next = 35;
            return _database.pool.query('SELECT (SELECT IFNULL(SUM(voting_id),0) FROM votingSuggest where suggest_id=? AND voting_id=1) AS plikes, (SELECT IFNULL(SUM(voting_id),0) FROM votingSuggest where suggest_id=? AND voting_id=-1) as pdislikes', [_links[suggest].id, _links[suggest].id]);

          case 35:
            progress = _context7.sent;
            _progress$ = progress[0], plikes = _progress$.plikes, pdislikes = _progress$.pdislikes;
            totalProgress = plikes + -1 * pdislikes;
            progressBar = void 0;

            if (totalProgress > 0) {
              progressBar = {
                plikes: plikes,
                pdislikes: pdislikes * -1,
                percentagel: plikes / totalProgress * 100,
                percentagedl: pdislikes * -1 / totalProgress * 100
              };
            } else progressBar = null;

            Object.assign(_links[suggest], {
              progressBar: progressBar
            });
            _context7.next = 27;
            break;

          case 43:
            pagination = {
              previous: null,
              current: null,
              next: null,
              first: null,
              last: null
            };
            if (page == 1 && numPages == 1) pagination.first = true;else if (page != numPages || numPages == 1) pagination.last = true;
            if (page == 1) pagination.first = null;else if (page > 2) pagination.first = true;
            pagination.current = page;
            pagination.previous = Number(page) - 1;
            nextp = Number(page) + 1;
            if (nextp < numPages) pagination.next = nextp;
            console.log(pagination);
            res.render('links/list', {
              links: _links,
              pagination: pagination,
              numPages: numPages
            });
            _context7.next = 58;
            break;

          case 54:
            _context7.prev = 54;
            _context7.t2 = _context7["catch"](0);
            req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
            res.redirect('back');

          case 58:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[0, 54]]);
  }));

  return function renderLinksByPage(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();

exports.renderLinksByPage = renderLinksByPage;

var renderMyLinks = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res) {
    var links;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return _database.pool.query('SELECT * FROM links WHERE player_id=?', [req.user.id]);

          case 2:
            links = _context8.sent;
            res.render('links/list', {
              links: links
            });

          case 4:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function renderMyLinks(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();

exports.renderMyLinks = renderMyLinks;

var renderLinksByStatus = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res) {
    var id, links;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            id = req.params.id;
            _context9.next = 3;
            return _database.pool.query('SELECT * FROM links WHERE status_id=?', [id]);

          case 3:
            links = _context9.sent;

            if (links[0]) {
              _context9.next = 7;
              break;
            }

            res.redirect('/links');
            return _context9.abrupt("return");

          case 7:
            res.render('links/list', {
              links: links
            });

          case 8:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function renderLinksByStatus(_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}();

exports.renderLinksByStatus = renderLinksByStatus;

var renderDetailedLink = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res) {
    var id, _links2, comments, key, reply, rkey, nick, images, progress, _progress$2, plikes, pdislikes, totalProgress, progressBar, count, likedby, url, likes, voteType, own, _links2$, title, body, created_at, status_id, idl;

    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.prev = 0;
            id = req.params.id;
            _context10.next = 4;
            return _database.pool.query('SELECT * FROM links WHERE id=?', [id]);

          case 4:
            _links2 = _context10.sent;

            if (_links2[0]) {
              _context10.next = 9;
              break;
            }

            req.flash('message', 'Sugerencia no encontrada.');
            res.redirect('back');
            return _context10.abrupt("return");

          case 9:
            _context10.next = 11;
            return _database.pool.query('SELECT comments.id,comments.text, comments.created_at ,images.filename, images.nick FROM comments INNER JOIN images ON comments.player_id=images.player_id WHERE comments.links_id=? ORDER BY created_at ASC', [id]);

          case 11:
            comments = _context10.sent;
            _context10.t0 = _regenerator["default"].keys(comments);

          case 13:
            if ((_context10.t1 = _context10.t0()).done) {
              _context10.next = 33;
              break;
            }

            key = _context10.t1.value;
            _context10.next = 17;
            return _database.pool.query('SELECT reply.id,reply.text,reply.comment_id,reply.created_at,reply.reply_id,reply.player_id,images.filename,images.nick FROM reply,images WHERE reply.player_id = images.player_id AND reply.comment_id = ?', [comments[key].id]);

          case 17:
            reply = _context10.sent;
            if (comments[key].nick == req.user.realname) Object.assign(comments[key], {
              owned: true
            });
            _context10.t2 = _regenerator["default"].keys(reply);

          case 20:
            if ((_context10.t3 = _context10.t2()).done) {
              _context10.next = 30;
              break;
            }

            rkey = _context10.t3.value;
            if (reply[rkey].nick == req.user.realname) Object.assign(reply[rkey], {
              owned: true
            });

            if (!reply[rkey].reply_id) {
              _context10.next = 28;
              break;
            }

            _context10.next = 26;
            return _database.pool.query('SELECT images.nick as rn FROM images INNER JOIN reply ON reply.player_id=images.player_id WHERE reply.player_id=? AND reply.reply_id=?', [reply[rkey].player_id, reply[rkey].reply_id]);

          case 26:
            nick = _context10.sent;
            Object.assign(reply[rkey], {
              reply_nick: nick[0].rn
            });

          case 28:
            _context10.next = 20;
            break;

          case 30:
            Object.assign(comments[key], {
              reply: reply
            });
            _context10.next = 13;
            break;

          case 33:
            _context10.next = 35;
            return _database.pool.query('SELECT * FROM images WHERE player_id=?', [_links2[0].player_id]);

          case 35:
            images = _context10.sent;
            _context10.next = 38;
            return _database.pool.query('SELECT (SELECT IFNULL(SUM(voting_id),0) FROM votingSuggest where suggest_id=? AND voting_id=1) AS plikes, (SELECT IFNULL(SUM(voting_id),0) FROM votingSuggest where suggest_id=? AND voting_id=-1) as pdislikes', [id, id]);

          case 38:
            progress = _context10.sent;
            _progress$2 = progress[0], plikes = _progress$2.plikes, pdislikes = _progress$2.pdislikes;
            totalProgress = plikes + -1 * pdislikes;

            if (totalProgress > 0) {
              progressBar = {
                plikes: plikes,
                pdislikes: pdislikes * -1,
                percentagel: plikes / totalProgress * 100,
                percentagedl: pdislikes * -1 / totalProgress * 100
              };
            } else progressBar = null;

            _context10.next = 44;
            return _database.pool.query('SELECT IFNULL(SUM(voting_id),0) as total FROM votingSuggest where suggest_id=?', [id]);

          case 44:
            count = _context10.sent;
            _context10.next = 47;
            return _database.pool.query('SELECT * FROM votingSuggest where suggest_id=? and player_id=?', [id, req.user.id]);

          case 47:
            likedby = _context10.sent;
            url = images[0].filename;
            likes = count[0].total;

            if (likedby[0]) {
              voteType = likedby[0].voting_id;
            } else voteType = 0;

            if (_links2[0].player_id === req.user.id) own = true;else own = false;
            _links2$ = _links2[0], title = _links2$.title, body = _links2$.body, created_at = _links2$.created_at, status_id = _links2$.status_id;
            idl = _links2[0].id;
            res.render('links/detail', {
              links: _links2,
              comments: comments,
              title: title,
              body: body,
              created_at: created_at,
              status_id: status_id,
              url: url,
              own: own,
              idl: idl,
              likes: likes,
              likedby: likedby,
              voteType: voteType,
              progressBar: progressBar
            });
            _context10.next = 61;
            break;

          case 57:
            _context10.prev = 57;
            _context10.t4 = _context10["catch"](0);
            req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
            res.redirect('back');

          case 61:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[0, 57]]);
  }));

  return function renderDetailedLink(_x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}();

exports.renderDetailedLink = renderDetailedLink;

var deleteLink = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res) {
    var id, link;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.prev = 0;
            id = req.params.id;
            _context11.next = 4;
            return _database.pool.query('SELECT player_id FROM links WHERE id=?', [id]);

          case 4:
            link = _context11.sent;

            if (links[0]) {
              _context11.next = 9;
              break;
            }

            req.flash('message', 'La sugerencia no existe.');
            res.redirect('back');
            return _context11.abrupt("return");

          case 9:
            if (!(link[0].player_id == req.user.id)) {
              _context11.next = 15;
              break;
            }

            _context11.next = 12;
            return _database.pool.query('DELETE FROM links where id=?', [id]);

          case 12:
            req.flash('success', 'Sugerencia eliminada correctamente!');
            _context11.next = 16;
            break;

          case 15:
            req.flash('success', 'No puedes borrar esta sugerencia');

          case 16:
            res.redirect('/links');
            _context11.next = 23;
            break;

          case 19:
            _context11.prev = 19;
            _context11.t0 = _context11["catch"](0);
            req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
            res.redirect('back');

          case 23:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[0, 19]]);
  }));

  return function deleteLink(_x21, _x22) {
    return _ref11.apply(this, arguments);
  };
}();

exports.deleteLink = deleteLink;

var deleteComment = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res) {
    var id, comment;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.prev = 0;
            id = req.params.id;
            _context12.next = 4;
            return _database.pool.query('SELECT * FROM comments WHERE id=?', [id]);

          case 4:
            comment = _context12.sent;

            if (!(!comment[0] || comment[0].player_id != req.user.id)) {
              _context12.next = 9;
              break;
            }

            req.flash('message', 'El comentario no te pertenece.');
            res.redirect('back');
            return _context12.abrupt("return");

          case 9:
            _context12.next = 11;
            return _database.pool.query('DELETE FROM comments where id=?', [id]);

          case 11:
            req.flash('success', 'Comentario eliminado correctamente');
            res.redirect('back');
            _context12.next = 20;
            break;

          case 15:
            _context12.prev = 15;
            _context12.t0 = _context12["catch"](0);
            req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
            res.redirect('back');
            console.log(_context12.t0);

          case 20:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, null, [[0, 15]]);
  }));

  return function deleteComment(_x23, _x24) {
    return _ref12.apply(this, arguments);
  };
}();

exports.deleteComment = deleteComment;

var deleteReply = /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(req, res) {
    var id, reply;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.prev = 0;
            id = req.params.id;
            _context13.next = 4;
            return _database.pool.query('SELECT * FROM reply where id=?', [id]);

          case 4:
            reply = _context13.sent;

            if (!(!reply[0] || reply[0].player_id != req.user.id)) {
              _context13.next = 9;
              break;
            }

            req.flash('message', 'El comentario no te pertenece.');
            res.redirect('back');
            return _context13.abrupt("return");

          case 9:
            _context13.next = 11;
            return _database.pool.query('DELETE FROM reply where id=?', [id]);

          case 11:
            req.flash('success', 'Comentario eliminado correctamente');
            res.redirect('back');
            _context13.next = 19;
            break;

          case 15:
            _context13.prev = 15;
            _context13.t0 = _context13["catch"](0);
            req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
            res.redirect('back');

          case 19:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, null, [[0, 15]]);
  }));

  return function deleteReply(_x25, _x26) {
    return _ref13.apply(this, arguments);
  };
}();

exports.deleteReply = deleteReply;

var likeSuggest = /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(req, res) {
    var id, player_id, newVote, isLiked, count, votingid, progress, status, likes, data;
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.prev = 0;
            id = req.params.id;
            player_id = req.user.id;
            newVote = {
              player_id: player_id,
              suggest_id: id,
              voting_id: 1
            };
            _context14.next = 6;
            return _database.pool.query('SELECT * FROM votingSuggest WHERE player_id=? AND suggest_id=?', [player_id, id]);

          case 6:
            isLiked = _context14.sent;

            if (!isLiked[0]) {
              _context14.next = 19;
              break;
            }

            if (!(isLiked[0].voting_id == 1)) {
              _context14.next = 13;
              break;
            }

            _context14.next = 11;
            return _database.pool.query('DELETE FROM votingSuggest WHERE player_id=? AND suggest_id=?', [player_id, id]);

          case 11:
            _context14.next = 17;
            break;

          case 13:
            _context14.next = 15;
            return _database.pool.query('DELETE FROM votingSuggest WHERE player_id=? AND suggest_id=?', [player_id, id]);

          case 15:
            _context14.next = 17;
            return _database.pool.query('INSERT INTO votingSuggest SET ?', [newVote]);

          case 17:
            _context14.next = 21;
            break;

          case 19:
            _context14.next = 21;
            return _database.pool.query('INSERT INTO votingSuggest SET ?', [newVote]);

          case 21:
            _context14.next = 23;
            return _database.pool.query('SELECT IFNULL(SUM(voting_id),0) as total FROM votingSuggest where suggest_id=?', [id]);

          case 23:
            count = _context14.sent;
            _context14.next = 26;
            return _database.pool.query('SELECT voting_id FROM votingSuggest WHERE player_id=? AND suggest_id=?', [player_id, id]);

          case 26:
            votingid = _context14.sent;
            _context14.next = 29;
            return _database.pool.query('SELECT (SELECT IFNULL(SUM(voting_id),0) FROM votingSuggest where suggest_id=? AND voting_id=1) AS plikes, (SELECT IFNULL(SUM(voting_id),0) FROM votingSuggest where suggest_id=? AND voting_id=-1) as pdislikes', [id, id]);

          case 29:
            progress = _context14.sent;
            if (!votingid[0]) status = 0;else status = votingid[0].voting_id;
            if (progress[0]) likes = progress[0];else likes = {
              plikes: 0,
              pdislikes: 0
            };
            data = {
              votes: count[0],
              status: status,
              likes: likes
            };
            res.json(data);
            _context14.next = 39;
            break;

          case 36:
            _context14.prev = 36;
            _context14.t0 = _context14["catch"](0);
            res.json({
              error: 'Algo salió mal. Inténtalo de nuevo más tarde.'
            });

          case 39:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, null, [[0, 36]]);
  }));

  return function likeSuggest(_x27, _x28) {
    return _ref14.apply(this, arguments);
  };
}();

exports.likeSuggest = likeSuggest;

var dislikeSuggest = /*#__PURE__*/function () {
  var _ref15 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(req, res) {
    var id, player_id, newVote, isLiked, count, votingid, progress, status, likes, data;
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.prev = 0;
            id = req.params.id;
            player_id = req.user.id;
            newVote = {
              player_id: player_id,
              suggest_id: id,
              voting_id: -1
            };
            _context15.next = 6;
            return _database.pool.query('SELECT * FROM votingSuggest WHERE player_id=? AND suggest_id=?', [player_id, id]);

          case 6:
            isLiked = _context15.sent;

            if (!isLiked[0]) {
              _context15.next = 19;
              break;
            }

            if (!(isLiked[0].voting_id == -1)) {
              _context15.next = 13;
              break;
            }

            _context15.next = 11;
            return _database.pool.query('DELETE FROM votingSuggest WHERE player_id=? AND suggest_id=?', [player_id, id]);

          case 11:
            _context15.next = 17;
            break;

          case 13:
            _context15.next = 15;
            return _database.pool.query('DELETE FROM votingSuggest WHERE player_id=? AND suggest_id=?', [player_id, id]);

          case 15:
            _context15.next = 17;
            return _database.pool.query('INSERT INTO votingSuggest SET ?', [newVote]);

          case 17:
            _context15.next = 21;
            break;

          case 19:
            _context15.next = 21;
            return _database.pool.query('INSERT INTO votingSuggest SET ?', [newVote]);

          case 21:
            _context15.next = 23;
            return _database.pool.query('SELECT IFNULL(SUM(voting_id),0) as total FROM votingSuggest where suggest_id=?', [id]);

          case 23:
            count = _context15.sent;
            _context15.next = 26;
            return _database.pool.query('SELECT voting_id FROM votingSuggest WHERE player_id=? AND suggest_id=?', [player_id, id]);

          case 26:
            votingid = _context15.sent;
            _context15.next = 29;
            return _database.pool.query('SELECT (SELECT IFNULL(SUM(voting_id),0) FROM votingSuggest where suggest_id=? AND voting_id=1) AS plikes, (SELECT IFNULL(SUM(voting_id),0) FROM votingSuggest where suggest_id=? AND voting_id=-1) as pdislikes', [id, id]);

          case 29:
            progress = _context15.sent;
            if (!votingid[0]) status = 0;else status = votingid[0].voting_id;
            if (progress[0]) likes = progress[0];else likes = {
              plikes: 0,
              pdislikes: 0
            };
            data = {
              votes: count[0],
              status: status,
              likes: likes
            };
            res.json(data);
            _context15.next = 39;
            break;

          case 36:
            _context15.prev = 36;
            _context15.t0 = _context15["catch"](0);
            res.json({
              error: 'Algo salió mal. Inténtalo de nuevo más tarde.'
            });

          case 39:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15, null, [[0, 36]]);
  }));

  return function dislikeSuggest(_x29, _x30) {
    return _ref15.apply(this, arguments);
  };
}();

exports.dislikeSuggest = dislikeSuggest;

var likeComment = /*#__PURE__*/function () {
  var _ref16 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16(req, res) {
    var id, player_id, newVote, isLiked, count, votingid, status, data;
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _context16.prev = 0;
            id = req.params.id;
            player_id = req.user.id;
            newVote = {
              player_id: player_id,
              comment_id: id,
              voting_id: 1
            };
            _context16.next = 6;
            return _database.pool.query('SELECT * FROM votingcomment WHERE player_id=? AND comment_id=?', [player_id, id]);

          case 6:
            isLiked = _context16.sent;

            if (!isLiked[0]) {
              _context16.next = 19;
              break;
            }

            if (!(isLiked[0].voting_id == 1)) {
              _context16.next = 13;
              break;
            }

            _context16.next = 11;
            return _database.pool.query('DELETE FROM votingcomment WHERE player_id=? AND comment_id=?', [player_id, id]);

          case 11:
            _context16.next = 17;
            break;

          case 13:
            _context16.next = 15;
            return _database.pool.query('DELETE FROM votingcomment WHERE player_id=? AND comment_id=?', [player_id, id]);

          case 15:
            _context16.next = 17;
            return _database.pool.query('INSERT INTO votingcomment SET ?', [newVote]);

          case 17:
            _context16.next = 21;
            break;

          case 19:
            _context16.next = 21;
            return _database.pool.query('INSERT INTO votingcomment SET ?', [newVote]);

          case 21:
            _context16.next = 23;
            return _database.pool.query('SELECT IFNULL(SUM(voting_id),0) as total FROM votingcomment where comment_id=?', [id]);

          case 23:
            count = _context16.sent;
            _context16.next = 26;
            return _database.pool.query('SELECT voting_id FROM votingcomment WHERE player_id=? AND comment_id=?', [player_id, id]);

          case 26:
            votingid = _context16.sent;
            if (!votingid[0]) status = 0;else status = votingid[0].voting_id;
            data = {
              votes: count[0],
              status: status
            };
            res.json(data);
            _context16.next = 35;
            break;

          case 32:
            _context16.prev = 32;
            _context16.t0 = _context16["catch"](0);
            res.json({
              error: 'Algo salió mal. Inténtalo de nuevo más tarde.'
            });

          case 35:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16, null, [[0, 32]]);
  }));

  return function likeComment(_x31, _x32) {
    return _ref16.apply(this, arguments);
  };
}();

exports.likeComment = likeComment;

var dislikeComment = /*#__PURE__*/function () {
  var _ref17 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17(req, res) {
    var id, player_id, newVote, isLiked, count, votingid, status, data;
    return _regenerator["default"].wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _context17.prev = 0;
            id = req.params.id;
            player_id = req.user.id;
            newVote = {
              player_id: player_id,
              comment_id: id,
              voting_id: -1
            };
            _context17.next = 6;
            return _database.pool.query('SELECT * FROM votingcomment WHERE player_id=? AND comment_id=?', [player_id, id]);

          case 6:
            isLiked = _context17.sent;

            if (!isLiked[0]) {
              _context17.next = 19;
              break;
            }

            if (!(isLiked[0].voting_id == -1)) {
              _context17.next = 13;
              break;
            }

            _context17.next = 11;
            return _database.pool.query('DELETE FROM votingcomment WHERE player_id=? AND comment_id=?', [player_id, id]);

          case 11:
            _context17.next = 17;
            break;

          case 13:
            _context17.next = 15;
            return _database.pool.query('DELETE FROM votingcomment WHERE player_id=? AND comment_id=?', [player_id, id]);

          case 15:
            _context17.next = 17;
            return _database.pool.query('INSERT INTO votingcomment SET ?', [newVote]);

          case 17:
            _context17.next = 21;
            break;

          case 19:
            _context17.next = 21;
            return _database.pool.query('INSERT INTO votingcomment SET ?', [newVote]);

          case 21:
            _context17.next = 23;
            return _database.pool.query('SELECT IFNULL(SUM(voting_id),0) as total FROM votingcomment where comment_id=?', [id]);

          case 23:
            count = _context17.sent;
            _context17.next = 26;
            return _database.pool.query('SELECT voting_id FROM votingcomment WHERE player_id=? AND comment_id=?', [player_id, id]);

          case 26:
            votingid = _context17.sent;
            if (!votingid[0]) status = 0;else status = votingid[0].voting_id;
            data = {
              votes: count[0],
              status: status
            };
            res.json(data);
            _context17.next = 35;
            break;

          case 32:
            _context17.prev = 32;
            _context17.t0 = _context17["catch"](0);
            res.json({
              error: 'Algo salió mal. Inténtalo de nuevo más tarde.'
            });

          case 35:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17, null, [[0, 32]]);
  }));

  return function dislikeComment(_x33, _x34) {
    return _ref17.apply(this, arguments);
  };
}();

exports.dislikeComment = dislikeComment;

var likeReply = /*#__PURE__*/function () {
  var _ref18 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18(req, res) {
    var id, player_id, newVote, isLiked, count, votingid, status, data;
    return _regenerator["default"].wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            _context18.prev = 0;
            id = req.params.id;
            player_id = req.user.id;
            newVote = {
              player_id: player_id,
              reply_id: id,
              voting_id: 1
            };
            _context18.next = 6;
            return _database.pool.query('SELECT * FROM votingreply WHERE player_id=? AND reply_id=?', [player_id, id]);

          case 6:
            isLiked = _context18.sent;

            if (!isLiked[0]) {
              _context18.next = 19;
              break;
            }

            if (!(isLiked[0].voting_id == 1)) {
              _context18.next = 13;
              break;
            }

            _context18.next = 11;
            return _database.pool.query('DELETE FROM votingreply WHERE player_id=? AND reply_id=?', [player_id, id]);

          case 11:
            _context18.next = 17;
            break;

          case 13:
            _context18.next = 15;
            return _database.pool.query('DELETE FROM votingreply WHERE player_id=? AND reply_id=?', [player_id, id]);

          case 15:
            _context18.next = 17;
            return _database.pool.query('INSERT INTO votingreply SET ?', [newVote]);

          case 17:
            _context18.next = 21;
            break;

          case 19:
            _context18.next = 21;
            return _database.pool.query('INSERT INTO votingreply SET ?', [newVote]);

          case 21:
            _context18.next = 23;
            return _database.pool.query('SELECT IFNULL(SUM(voting_id),0) as total FROM votingreply where reply_id=?', [id]);

          case 23:
            count = _context18.sent;
            _context18.next = 26;
            return _database.pool.query('SELECT voting_id FROM votingreply WHERE player_id=? AND reply_id=?', [player_id, id]);

          case 26:
            votingid = _context18.sent;
            if (!votingid[0]) status = 0;else status = votingid[0].voting_id;
            data = {
              votes: count[0],
              status: status
            };
            res.json(data);
            _context18.next = 35;
            break;

          case 32:
            _context18.prev = 32;
            _context18.t0 = _context18["catch"](0);
            res.json({
              error: 'Algo salió mal. Inténtalo de nuevo más tarde.'
            });

          case 35:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18, null, [[0, 32]]);
  }));

  return function likeReply(_x35, _x36) {
    return _ref18.apply(this, arguments);
  };
}();

exports.likeReply = likeReply;

var dislikeReply = /*#__PURE__*/function () {
  var _ref19 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19(req, res) {
    var id, player_id, newVote, isLiked, count, votingid, status, data;
    return _regenerator["default"].wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            _context19.prev = 0;
            id = req.params.id;
            player_id = req.user.id;
            newVote = {
              player_id: player_id,
              reply_id: id,
              voting_id: -1
            };
            _context19.next = 6;
            return _database.pool.query('SELECT * FROM votingreply WHERE player_id=? AND reply_id=?', [player_id, id]);

          case 6:
            isLiked = _context19.sent;

            if (!isLiked[0]) {
              _context19.next = 19;
              break;
            }

            if (!(isLiked[0].voting_id == -1)) {
              _context19.next = 13;
              break;
            }

            _context19.next = 11;
            return _database.pool.query('DELETE FROM votingreply WHERE player_id=? AND reply_id=?', [player_id, id]);

          case 11:
            _context19.next = 17;
            break;

          case 13:
            _context19.next = 15;
            return _database.pool.query('DELETE FROM votingreply WHERE player_id=? AND reply_id=?', [player_id, id]);

          case 15:
            _context19.next = 17;
            return _database.pool.query('INSERT INTO votingreply SET ?', [newVote]);

          case 17:
            _context19.next = 21;
            break;

          case 19:
            _context19.next = 21;
            return _database.pool.query('INSERT INTO votingreply SET ?', [newVote]);

          case 21:
            _context19.next = 23;
            return _database.pool.query('SELECT IFNULL(SUM(voting_id),0) as total FROM votingreply where reply_id=?', [id]);

          case 23:
            count = _context19.sent;
            _context19.next = 26;
            return _database.pool.query('SELECT voting_id FROM votingreply WHERE player_id=? AND reply_id=?', [player_id, id]);

          case 26:
            votingid = _context19.sent;
            if (!votingid[0]) status = 0;else status = votingid[0].voting_id;
            data = {
              votes: count[0],
              status: status
            };
            res.json(data);
            _context19.next = 35;
            break;

          case 32:
            _context19.prev = 32;
            _context19.t0 = _context19["catch"](0);
            res.json({
              error: 'Algo salió mal. Inténtalo de nuevo más tarde.'
            });

          case 35:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19, null, [[0, 32]]);
  }));

  return function dislikeReply(_x37, _x38) {
    return _ref19.apply(this, arguments);
  };
}();

exports.dislikeReply = dislikeReply;