"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPositive = exports.isEmpty = exports.isUrl = exports.isDenied = exports.isAccepted = exports.isPending = exports.timeago = void 0;

var _timeago = require("timeago.js");

var timeago = function timeago(savedTimestamp) {
  return (0, _timeago.format)(savedTimestamp, 'es');
};

exports.timeago = timeago;

var isPending = function isPending(status) {
  return status === 1;
};

exports.isPending = isPending;

var isAccepted = function isAccepted(status) {
  return status === 2;
};

exports.isAccepted = isAccepted;

var isDenied = function isDenied(status) {
  return status === 3;
};

exports.isDenied = isDenied;

var isUrl = function isUrl(url) {
  return url.includes('http');
};

exports.isUrl = isUrl;

var isEmpty = function isEmpty(votes) {
  return votes === 0;
};

exports.isEmpty = isEmpty;

var isPositive = function isPositive(votes) {
  return votes > 0;
};

exports.isPositive = isPositive;