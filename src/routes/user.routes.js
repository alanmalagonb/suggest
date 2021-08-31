import { Router } from "express";
import { isLoggedIn } from "../lib/auth";
import { renderUserProfile, updateImage } from "../controllers/user.controller";

const router = Router();

router.get("/profile", isLoggedIn, renderUserProfile);
router.post("/profile", isLoggedIn, updateImage);


export default router;