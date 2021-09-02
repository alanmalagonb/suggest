"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _auth = require("../lib/auth");

var _links = require("../controllers/links.controller");

var _validation = require("../lib/validation");

var router = (0, _express.Router)(); // Authorization

router.use(_auth.isLoggedIn); // Routes

router.get("/", function (req, res) {
  res.redirect("/links/pag/1");
});
router.get("/add", _links.renderAddLink);
router.post("/add", _validation.checkAddLink, _links.addLink);
router.post("/comment/:id", _validation.checkAddComment, _links.addComment);
router.post("/reply/:id", _validation.checkAddReply, _links.replyComment);
router.post("/reply/:id/:idr", _validation.checkAddRReply, _links.replyComment);
router.get("/pag/:id", _auth.isLoggedIn, _validation.checkPage, _links.renderLinksByPage);
router.get("/me", _auth.isLoggedIn, _links.renderMyLinks);
router.get("/status/:id", _auth.isLoggedIn, _links.renderLinksByStatus);
router.get("/detail/:id", _auth.isLoggedIn, _links.renderDetailedLink);
router.get("/delete/:id", _links.deleteLink);
router.post("/like/suggest/:id", _links.likeSuggest);
router.post("/dislike/suggest/:id", _links.dislikeSuggest);
router.post("/like/comment/:id", _links.likeComment);
router.post("/dislike/comment/:id", _links.dislikeComment);
router.post("/like/reply/:id", _links.likeReply);
router.post("/dislike/reply/:id", _links.dislikeReply);
router.get("/delete/comment/:id", _auth.isLoggedIn, _links.deleteComment);
router.get("/delete/reply/:id", _auth.isLoggedIn, _links.deleteReply);
router.post("/edit/reply/:id", _auth.isLoggedIn, _validation.checkUpdateReply, _links.updateReplyComment);
router.post("/edit/comment/:id", _auth.isLoggedIn, _validation.checkUpdateComment, _links.updateComment);
var _default = router;
exports["default"] = _default;