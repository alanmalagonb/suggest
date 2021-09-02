"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkSignIn = exports.checkUpdateComment = exports.checkUpdateReply = exports.checkPage = exports.checkAddRReply = exports.checkAddReply = exports.checkAddComment = exports.checkAddLink = void 0;

var _expressValidator = require("express-validator");

var checkAddLink = [(0, _expressValidator.body)('title', 'Escribe un título').not().isEmpty(), (0, _expressValidator.body)('description', 'Escribe una descripción').not().isEmpty()];
exports.checkAddLink = checkAddLink;
var checkAddComment = [(0, _expressValidator.param)('id', 'La sugerencia no existe').isNumeric(), (0, _expressValidator.body)('comment', 'Escribe un comentario').not().isEmpty()];
exports.checkAddComment = checkAddComment;
var checkAddReply = [(0, _expressValidator.param)('id', 'El comentario no existe').isNumeric(), (0, _expressValidator.body)('reply', 'Escribe una respuesta').not().isEmpty()];
exports.checkAddReply = checkAddReply;
var checkAddRReply = [(0, _expressValidator.param)('id', 'El comentario no existe').isNumeric(), (0, _expressValidator.param)('idr', 'El comentario no existe').isNumeric(), (0, _expressValidator.body)('reply', 'Escribe una respuesta').not().isEmpty()];
exports.checkAddRReply = checkAddRReply;
var checkPage = [(0, _expressValidator.param)('id', 'La página no existe').isNumeric()];
exports.checkPage = checkPage;
var checkUpdateReply = [(0, _expressValidator.param)('id', 'El comentario no existe').isNumeric(), (0, _expressValidator.body)('text', 'Escribe un comentario').not().isEmpty()];
exports.checkUpdateReply = checkUpdateReply;
var checkUpdateComment = [(0, _expressValidator.param)('id', 'El comentario no existe').isNumeric(), (0, _expressValidator.body)('text', 'Escribe un comentario').not().isEmpty()];
exports.checkUpdateComment = checkUpdateComment;
var checkSignIn = [(0, _expressValidator.body)('username', 'Escribe un usuario.').not().isEmpty(), (0, _expressValidator.body)('password', 'Escribe una contraseña,').not().isEmpty()];
exports.checkSignIn = checkSignIn;