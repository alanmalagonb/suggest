import { Router } from "express";
import { isLoggedIn, isAdmin } from "../lib/auth";
import {
    renderAllSuggests,
    renderByStatus,
    renderById,
    acceptSuggest,
    denySuggest,
    deleteSuggest,
    deleteComment,
    deleteReply,
    deleteAdmin,
    listAdmins,
    addAdmin
} from "../controllers/admin.controller";
import {
    checkPage,
} from "../lib/validation";
const router = Router();
// Authorization
router.use(isLoggedIn);

// Routes
router.get("/", isAdmin, (req, res) => { res.redirect("/admin/pag/1"); });
router.get("/pag/:id", isAdmin, checkPage, renderAllSuggests);
router.get("/:id", isAdmin, renderByStatus);
router.get("/detail/:id", isAdmin, renderById);
router.get("/accept/:id", isAdmin, acceptSuggest);
router.get("/deny/:id", isAdmin, denySuggest);
router.get("/delete/:id", isAdmin, deleteSuggest);
router.get("/delete/comment/:id", isAdmin, deleteComment);
router.get("/delete/reply/:id", isAdmin, deleteReply);
router.get("/deletea/:id", isAdmin, deleteAdmin);
router.get("/list/admins", isAdmin, listAdmins);
router.post("/add/admin", isAdmin, addAdmin);

export default router;