"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _auth = require("../lib/auth");

var _auth2 = require("../controllers/auth.controller");

var _validation = require("../lib/validation");

var router = (0, _express.Router)();
// SINGIN
router.get("/signin", _auth.isNotLoggedIn, _auth2.renderSignIn);
router.post("/signin", _auth.isNotLoggedIn, _validation.checkSignIn, _auth2.signIn);
router.get("/logout", _auth.isLoggedIn, _auth2.logout);
var _default = router;
exports["default"] = _default;