import { Router } from "express";
import { isLoggedIn } from "../lib/auth";
import {
    renderAddLink,
    addLink,
    renderLinksByPage,
    renderMyLinks,
    renderLinksByStatus,
    renderDetailedLink,
    deleteLink,
    addComment,
    replyComment,
    likeSuggest,
    dislikeSuggest,
    deleteComment,
    deleteReply,
    updateReplyComment,
    likeComment,
    dislikeComment,
    likeReply,
    dislikeReply,
    updateComment,

} from "../controllers/links.controller";
import {
    checkAddComment,
    checkAddLink,
    checkAddReply,
    checkAddRReply,
    checkPage,
    checkUpdateReply,
    checkUpdateComment
} from "../lib/validation";
const router = Router();
// Authorization
router.use(isLoggedIn);

// Routes
router.get("/", (req, res) => { res.redirect("/links/pag/1"); });
router.get("/add", renderAddLink);
router.post("/add", checkAddLink, addLink);
router.post("/comment/:id", checkAddComment, addComment);
router.post("/reply/:id", checkAddReply, replyComment);
router.post("/reply/:id/:idr", checkAddRReply, replyComment);
router.get("/pag/:id", isLoggedIn, checkPage, renderLinksByPage);
router.get("/me", isLoggedIn, renderMyLinks);
router.get("/status/:id", isLoggedIn, renderLinksByStatus);
router.get("/detail/:id", isLoggedIn, renderDetailedLink);
router.get("/delete/:id", deleteLink);
router.post("/like/suggest/:id", likeSuggest);
router.post("/dislike/suggest/:id", dislikeSuggest);
router.post("/like/comment/:id", likeComment);
router.post("/dislike/comment/:id", dislikeComment);
router.post("/like/reply/:id", likeReply);
router.post("/dislike/reply/:id", dislikeReply);
router.get("/delete/comment/:id", isLoggedIn, deleteComment);
router.get("/delete/reply/:id", isLoggedIn, deleteReply);
router.post("/edit/reply/:id", isLoggedIn, checkUpdateReply, updateReplyComment);
router.post("/edit/comment/:id", isLoggedIn, checkUpdateComment, updateComment)

export default router;