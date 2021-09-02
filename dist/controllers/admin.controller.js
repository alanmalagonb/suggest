"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteAdmin = exports.addAdmin = exports.listAdmins = exports.deleteReply = exports.deleteComment = exports.deleteSuggest = exports.denySuggest = exports.acceptSuggest = exports.renderById = exports.renderByStatus = exports.renderAllSuggests = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _database = require("../database");

var _expressValidator = require("express-validator");

var renderAllSuggests = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var errors, errorstxt, msg, key, id, page, numPerPage, skip, limit, rows, numRows, numPages, links, suggest, realname, progress, _progress$, plikes, pdislikes, totalProgress, progressBar, pagination, nextp;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
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
            res.redirect('/links/');
            return _context.abrupt("return");

          case 9:
            id = req.params.id;
            page = id || 1;
            numPerPage = 10;
            skip = (Number(page) - 1) * numPerPage;
            limit = skip + ',' + numPerPage;
            _context.next = 16;
            return _database.pool.query('SELECT count(*) as numRows FROM links');

          case 16:
            rows = _context.sent;
            numRows = rows[0].numRows;
            numPages = Math.ceil(numRows / numPerPage);
            _context.next = 21;
            return _database.pool.query('SELECT links.*, images.filename AS image,lastlogin.last_con FROM links LEFT JOIN images ON links.player_id=images.player_id LEFT JOIN lastlogin ON links.player_id=lastlogin.player_id LIMIT ' + limit);

          case 21:
            links = _context.sent;
            console.log(links[0]);

            if (!(!links[0] && page != 1)) {
              _context.next = 27;
              break;
            }

            req.flash('message', 'La página no existe.');
            res.redirect('back');
            return _context.abrupt("return");

          case 27:
            _context.t0 = _regenerator["default"].keys(links);

          case 28:
            if ((_context.t1 = _context.t0()).done) {
              _context.next = 44;
              break;
            }

            suggest = _context.t1.value;
            _context.next = 32;
            return _database.poola.query('SELECT realname FROM authme WHERE id=?', [links[suggest].player_id]);

          case 32:
            realname = _context.sent;
            Object.assign(links[suggest], {
              nick: realname[0].realname
            });
            _context.next = 36;
            return _database.pool.query('SELECT (SELECT IFNULL(SUM(voting_id),0) FROM votingSuggest where suggest_id=? AND voting_id=1) AS plikes, (SELECT IFNULL(SUM(voting_id),0) FROM votingSuggest where suggest_id=? AND voting_id=-1) as pdislikes', [links[suggest].id, links[suggest].id]);

          case 36:
            progress = _context.sent;
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

            Object.assign(links[suggest], {
              progressBar: progressBar
            });
            _context.next = 28;
            break;

          case 44:
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
            res.render('admin/list', {
              links: links,
              pagination: pagination,
              numPages: numPages
            });
            _context.next = 59;
            break;

          case 55:
            _context.prev = 55;
            _context.t2 = _context["catch"](0);
            req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
            res.redirect('back');

          case 59:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 55]]);
  }));

  return function renderAllSuggests(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.renderAllSuggests = renderAllSuggests;

var renderByStatus = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var id, links;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            id = req.params.id;
            _context2.next = 4;
            return _database.pool.query('SELECT * FROM links WHERE status_id=?', [id]);

          case 4:
            links = _context2.sent;
            res.render('admin/list', {
              links: links
            });
            _context2.next = 12;
            break;

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](0);
            req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
            res.redirect('back');

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 8]]);
  }));

  return function renderByStatus(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.renderByStatus = renderByStatus;

var renderById = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var id, links, comments, key, reply, rkey, nick, images, progress, _progress$2, plikes, pdislikes, totalProgress, progressBar, count, likedby, url, likes, voteType, own, _links$, title, body, created_at, status_id, idl;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            id = req.params.id;
            _context3.next = 4;
            return _database.pool.query('SELECT * FROM links WHERE id=?', [id]);

          case 4:
            links = _context3.sent;

            if (links[0]) {
              _context3.next = 9;
              break;
            }

            req.flash('message', 'Sugerencia no encontrada.');
            res.redirect('back');
            return _context3.abrupt("return");

          case 9:
            _context3.next = 11;
            return _database.pool.query('SELECT comments.id,comments.text, comments.created_at ,images.filename, images.nick FROM comments INNER JOIN images ON comments.player_id=images.player_id WHERE comments.links_id=? ORDER BY created_at ASC', [id]);

          case 11:
            comments = _context3.sent;
            _context3.t0 = _regenerator["default"].keys(comments);

          case 13:
            if ((_context3.t1 = _context3.t0()).done) {
              _context3.next = 33;
              break;
            }

            key = _context3.t1.value;
            _context3.next = 17;
            return _database.pool.query('SELECT reply.id,reply.text,reply.comment_id,reply.created_at,reply.reply_id,reply.player_id,images.filename,images.nick FROM reply,images WHERE reply.player_id = images.player_id AND reply.comment_id = ?', [comments[key].id]);

          case 17:
            reply = _context3.sent;
            if (comments[key].nick == req.user.realname) Object.assign(comments[key], {
              owned: true
            });
            _context3.t2 = _regenerator["default"].keys(reply);

          case 20:
            if ((_context3.t3 = _context3.t2()).done) {
              _context3.next = 30;
              break;
            }

            rkey = _context3.t3.value;
            if (reply[rkey].nick == req.user.realname) Object.assign(reply[rkey], {
              owned: true
            });

            if (!reply[rkey].reply_id) {
              _context3.next = 28;
              break;
            }

            _context3.next = 26;
            return _database.pool.query('SELECT images.nick as rn FROM images INNER JOIN reply ON reply.player_id=images.player_id WHERE reply.player_id=? AND reply.reply_id=?', [reply[rkey].player_id, reply[rkey].reply_id]);

          case 26:
            nick = _context3.sent;
            Object.assign(reply[rkey], {
              reply_nick: nick[0].rn
            });

          case 28:
            _context3.next = 20;
            break;

          case 30:
            Object.assign(comments[key], {
              reply: reply
            });
            _context3.next = 13;
            break;

          case 33:
            _context3.next = 35;
            return _database.pool.query('SELECT * FROM images WHERE player_id=?', [links[0].player_id]);

          case 35:
            images = _context3.sent;
            _context3.next = 38;
            return _database.pool.query('SELECT (SELECT IFNULL(SUM(voting_id),0) FROM votingSuggest where suggest_id=? AND voting_id=1) AS plikes, (SELECT IFNULL(SUM(voting_id),0) FROM votingSuggest where suggest_id=? AND voting_id=-1) as pdislikes', [id, id]);

          case 38:
            progress = _context3.sent;
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

            _context3.next = 44;
            return _database.pool.query('SELECT IFNULL(SUM(voting_id),0) as total FROM votingSuggest where suggest_id=?', [id]);

          case 44:
            count = _context3.sent;
            _context3.next = 47;
            return _database.pool.query('SELECT * FROM votingSuggest where suggest_id=? and player_id=?', [id, req.user.id]);

          case 47:
            likedby = _context3.sent;
            url = images[0].filename;
            likes = count[0].total;

            if (likedby[0]) {
              voteType = likedby[0].voting_id;
            } else voteType = 0;

            if (links[0].player_id === req.user.id) own = true;else own = false;
            _links$ = links[0], title = _links$.title, body = _links$.body, created_at = _links$.created_at, status_id = _links$.status_id;
            idl = links[0].id;
            res.render('admin/detail', {
              links: links,
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
            _context3.next = 61;
            break;

          case 57:
            _context3.prev = 57;
            _context3.t4 = _context3["catch"](0);
            req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
            res.redirect('back');

          case 61:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 57]]);
  }));

  return function renderById(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

exports.renderById = renderById;

var acceptSuggest = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var id;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            id = req.params.id;
            _context4.next = 4;
            return _database.pool.query('UPDATE links SET status_id=2 WHERE id=?', [id]);

          case 4:
            req.flash('success', 'Sugerencia Aceptada');
            res.redirect('/admin/detail/' + id);
            _context4.next = 12;
            break;

          case 8:
            _context4.prev = 8;
            _context4.t0 = _context4["catch"](0);
            req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
            res.redirect('back');

          case 12:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 8]]);
  }));

  return function acceptSuggest(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

exports.acceptSuggest = acceptSuggest;

var denySuggest = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var id;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            id = req.params.id;
            _context5.next = 4;
            return _database.pool.query('UPDATE links SET status_id=3 WHERE id=?', [id]);

          case 4:
            req.flash('success', 'Sugerencia Rechazada');
            res.redirect('/admin/detail/' + id);
            _context5.next = 12;
            break;

          case 8:
            _context5.prev = 8;
            _context5.t0 = _context5["catch"](0);
            req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
            res.redirect('back');

          case 12:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 8]]);
  }));

  return function denySuggest(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

exports.denySuggest = denySuggest;

var deleteSuggest = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var id;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            id = req.params.id;
            _context6.next = 4;
            return _database.pool.query('DELETE FROM links where id=?', [id]);

          case 4:
            req.flash('success', 'Sugerencia eliminada correctamente');
            res.redirect('/admin/pag/1');
            _context6.next = 12;
            break;

          case 8:
            _context6.prev = 8;
            _context6.t0 = _context6["catch"](0);
            req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
            res.redirect('/admin/pag/1');

          case 12:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 8]]);
  }));

  return function deleteSuggest(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

exports.deleteSuggest = deleteSuggest;

var deleteComment = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res) {
    var id;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            id = req.params.id;
            _context7.next = 4;
            return _database.pool.query('DELETE FROM reply where comment_id=?', [id]);

          case 4:
            _context7.next = 6;
            return _database.pool.query('DELETE FROM comments where id=?', [id]);

          case 6:
            req.flash('success', 'Comentario eliminado correctamente');
            res.redirect('back');
            _context7.next = 14;
            break;

          case 10:
            _context7.prev = 10;
            _context7.t0 = _context7["catch"](0);
            req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
            res.redirect('back');

          case 14:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[0, 10]]);
  }));

  return function deleteComment(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();

exports.deleteComment = deleteComment;

var deleteReply = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res) {
    var id;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            id = req.params.id;
            _context8.next = 4;
            return _database.pool.query('DELETE FROM reply where id=?', [id]);

          case 4:
            req.flash('success', 'Comentario eliminado correctamente');
            res.redirect('back');
            _context8.next = 12;
            break;

          case 8:
            _context8.prev = 8;
            _context8.t0 = _context8["catch"](0);
            req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
            res.redirect('back');

          case 12:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 8]]);
  }));

  return function deleteReply(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();

exports.deleteReply = deleteReply;

var listAdmins = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res) {
    var admins;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.prev = 0;
            _context9.next = 3;
            return _database.pool.query('SELECT * FROM admin');

          case 3:
            admins = _context9.sent;
            console.log(admins);
            res.render('admin/admins', {
              admins: admins
            });
            console.log(admins);
            _context9.next = 13;
            break;

          case 9:
            _context9.prev = 9;
            _context9.t0 = _context9["catch"](0);
            req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
            res.redirect('back');

          case 13:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[0, 9]]);
  }));

  return function listAdmins(_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}();

exports.listAdmins = listAdmins;

var addAdmin = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res) {
    var realname;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.prev = 0;
            realname = req.body.realname;
            _context10.next = 4;
            return _database.pool.query('INSERT INTO admin SET realname=?', [realname]);

          case 4:
            req.flash('success', 'Administrador agregado correctamente');
            res.redirect('back');
            _context10.next = 13;
            break;

          case 8:
            _context10.prev = 8;
            _context10.t0 = _context10["catch"](0);
            console.log(_context10.t0);
            req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
            res.redirect('back');

          case 13:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[0, 8]]);
  }));

  return function addAdmin(_x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}();

exports.addAdmin = addAdmin;

var deleteAdmin = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res) {
    var id;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.prev = 0;
            id = req.params.id;
            _context11.next = 4;
            return _database.pool.query('DELETE FROM admin WHERE id=?', [id]);

          case 4:
            req.flash('success', 'Administrador eliminado');
            res.redirect('back');
            _context11.next = 12;
            break;

          case 8:
            _context11.prev = 8;
            _context11.t0 = _context11["catch"](0);
            req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
            res.redirect('back');

          case 12:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[0, 8]]);
  }));

  return function deleteAdmin(_x21, _x22) {
    return _ref11.apply(this, arguments);
  };
}();

exports.deleteAdmin = deleteAdmin;