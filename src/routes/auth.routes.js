import { Router } from "express";
const router = Router();
import { isLoggedIn, isNotLoggedIn } from "../lib/auth";

import {
    renderSignIn,
    signIn,
    logout,
} from "../controllers/auth.controller";

import {
    checkSignIn
} from "../lib/validation";
// SINGIN
router.get("/signin", isNotLoggedIn, renderSignIn);
router.post("/signin", isNotLoggedIn, checkSignIn, signIn);

router.get("/logout", isLoggedIn, logout);

export default router;