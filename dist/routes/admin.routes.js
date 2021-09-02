"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _auth = require("../lib/auth");

var _admin = require("../controllers/admin.controller");

var _validation = require("../lib/validation");

var router = (0, _express.Router)(); // Authorization

router.use(_auth.isLoggedIn); // Routes

router.get("/", _auth.isAdmin, function (req, res) {
  res.redirect("/admin/pag/1");
});
router.get("/pag/:id", _auth.isAdmin, _validation.checkPage, _admin.renderAllSuggests);
router.get("/:id", _auth.isAdmin, _admin.renderByStatus);
router.get("/detail/:id", _auth.isAdmin, _admin.renderById);
router.get("/accept/:id", _auth.isAdmin, _admin.acceptSuggest);
router.get("/deny/:id", _auth.isAdmin, _admin.denySuggest);
router.get("/delete/:id", _auth.isAdmin, _admin.deleteSuggest);
router.get("/delete/comment/:id", _auth.isAdmin, _admin.deleteComment);
router.get("/delete/reply/:id", _auth.isAdmin, _admin.deleteReply);
router.get("/deletea/:id", _auth.isAdmin, _admin.deleteAdmin);
router.get("/list/admins", _auth.isAdmin, _admin.listAdmins);
router.post("/add/admin", _auth.isAdmin, _admin.addAdmin);
var _default = router;
exports["default"] = _default;